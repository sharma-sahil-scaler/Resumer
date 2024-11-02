from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from app.services.profile import ProfileService
from pydantic import BaseModel
from app.services.suggestion import SuggestionService
from app.services.conversation import ConversationService
from app.services.profile import ProfileService
from typing import Dict

router = APIRouter()
suggestion_service = SuggestionService()
conversation_service = ConversationService()
profile_service = ProfileService()

class StartChatRequest(BaseModel):
    profile_id: str

@router.post("/start-chat", response_model=Dict[str, str])
async def start_chat(request: StartChatRequest, profile_service: ProfileService = Depends(ProfileService)):
    # Retrieve the user profile to verify it exists
    user_profile = await profile_service.get_profile(request.profile_id)
    if not user_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Store only the profile_id in the conversation entry
    conversation = await conversation_service.create_conversation(request.profile_id)

    # Return the generated chat_id
    return {"chat_id": str(conversation["_id"])}

@router.websocket("/companion/{chat_id}")
async def websocket_companion(websocket: WebSocket, chat_id: str):
    await websocket.accept()

    # Retrieve conversation and user profile
    conversation = await conversation_service.get_conversation(chat_id)
    profile_id = conversation.get("profile_id")
    user_profile = await profile_service.get_profile(profile_id)
    current_section = conversation.get("current_asection", "summary")
    response_count = conversation.get("response_count", 0)
    awaiting_confirmation = conversation.get("awaiting_confirmation", False)

    if not user_profile:
        await websocket.send_text("Error: User profile not found.")
        await websocket.close()
        return

    sections = ["summary", "work_experience", "skills"]

    def get_next_section(current):
        """Retrieve the next section in sequence."""
        try:
            index = sections.index(current)
            return sections[index + 1] if index + 1 < len(sections) else None
        except ValueError:
            return None

    # Step 1: Initial FOMO suggestion for the current section
    initial_message = suggestion_service.generate_fomo_suggestions(user_profile, current_section)
    await websocket.send_text(initial_message)
    await conversation_service.add_message(chat_id, "assistant", initial_message)

    try:
        # Step 2: Dynamic interaction flow for each section
        while True:
            user_response = await websocket.receive_text()
            await conversation_service.add_message(chat_id, "user", user_response)

            # Update the resume with the user's response for the current section
            # await profile_service.update_profile_section(profile_id, current_section, user_response)
            # updated_resume = await profile_service.generate_resume(profile_id)
            # await websocket.send_text(f"Updated Resume:\n\n{updated_resume}")

            # Retrieve the conversation history to provide context
            conversation_history = await conversation_service.get_conversation_history(chat_id)
            messages = [{"role": msg["role"], "content": msg["content"]} for msg in conversation_history]

            if awaiting_confirmation:
                if user_response.lower() in ["yes", "y", "next"]:
                    # Move to the next section if user is ready
                    current_section = get_next_section(current_section)
                    response_count = 0
                    awaiting_confirmation = False

                    if current_section:
                        await conversation_service.update_conversation(chat_id, {
                            "current_section": current_section,
                            "response_count": response_count,
                            "awaiting_confirmation": awaiting_confirmation
                        })
                        # Call generate_fomo_suggestions for the new section
                        next_section_message = suggestion_service.generate_fomo_suggestions(user_profile, current_section)
                        await websocket.send_text(next_section_message)
                        await conversation_service.add_message(chat_id, "assistant", next_section_message)
                    else:
                        await websocket.send_text("All sections have been covered. Great work on refining your resume!")
                        await websocket.close()
                        break  
                else:
                    awaiting_confirmation = False
                    follow_up_message = suggestion_service.generate_dynamic_response(messages)
                    await websocket.send_text(follow_up_message)
                    await conversation_service.add_message(chat_id, "assistant", follow_up_message)
            else:
                response_count += 1
                
                confirmation_message = suggestion_service.generate_dynamic_response(messages)

                await conversation_service.update_conversation(chat_id, {
                    "awaiting_confirmation": awaiting_confirmation,
                    "response_count": response_count
                })
                await websocket.send_text(confirmation_message)
                await conversation_service.add_message(chat_id, "assistant", confirmation_message)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for chat_id: {chat_id}")