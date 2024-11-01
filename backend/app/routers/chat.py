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

    # Retrieve conversation details, including the associated user profile
    conversation = await conversation_service.get_conversation(chat_id)
    profile_id = conversation.get("profile_id")  # Assuming conversation stores user_profile_id
    user_profile = await profile_service.get_profile(profile_id)  # Fetch the full UserProfile

    if not user_profile:
        await websocket.send_text("Error: User profile not found.")
        await websocket.close()
        return

    # Generate the initial message using the SuggestionService with the full UserProfile
    initial_message = suggestion_service.generate_fomo_suggestions(user_profile, chat_id)
    await websocket.send_text(initial_message)
    await conversation_service.add_message(chat_id, "assistant", initial_message)

    try:
        while True:
            user_response = await websocket.receive_text()
            await conversation_service.add_message(chat_id, "user", user_response)

            # Generate the next message based on the latest profile feedback loop
            next_message = suggestion_service.generate_fomo_suggestions(user_profile, chat_id)
            await websocket.send_text(next_message)
            await conversation_service.add_message(chat_id, "assistant", next_message)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for chat_id: {chat_id}")