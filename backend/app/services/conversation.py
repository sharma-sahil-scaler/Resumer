from app.database import db
from app.models.conversation import Conversation
from bson import ObjectId

class ConversationService:
    def __init__(self):
        self.collection = db["conversations"]

    async def create_conversation(self, profile_id: str) -> Conversation:
        conversation = {
            "profile_id": profile_id,
            "messages": [],
        }
        result = await self.collection.insert_one(conversation)
        return await self.collection.find_one({"_id": result.inserted_id})

    async def get_conversation(self, chat_id: str) -> Conversation:
        return await self.collection.find_one({"_id": ObjectId(chat_id)})

    async def add_message(self, chat_id: str, role: str, content: str):
        await self.collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": {"role": role, "content": content}}}
        )