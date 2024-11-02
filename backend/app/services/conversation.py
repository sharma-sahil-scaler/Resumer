from bson import ObjectId
from app.database import db  # Assuming db is the MongoDB client instance
from typing import List, Dict

class ConversationService:
    def __init__(self):
        self.collection = db["conversations"]

    async def create_conversation(self, profile_id: str):
        # Create a new conversation entry with the profile_id and return the inserted document
        conversation = {
            "profile_id": profile_id,
            "current_section": "summary",
            "response_count": 0,
            "awaiting_confirmation": False
        }
        result = await self.collection.insert_one(conversation)
        return await self.collection.find_one({"_id": result.inserted_id})

    async def get_conversation(self, chat_id: str):
        # Retrieve the conversation based on chat_id
        return await self.collection.find_one({"_id": ObjectId(chat_id)})

    async def add_message(self, chat_id: str, role: str, content: str):
        # Add a message to the conversation's message log
        await self.collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": {"role": role, "content": content}}}
        )

    async def update_conversation(self, chat_id: str, updates: dict):
        # Update specific fields in the conversation document
        await self.collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": updates}
        )
    
    async def get_conversation_history(self, chat_id: str) -> List[Dict[str, str]]:
        """Retrieve the entire message history for a given chat_id."""
        conversation = await self.get_conversation(chat_id)
        if conversation and "messages" in conversation:
            return conversation["messages"]
        return []