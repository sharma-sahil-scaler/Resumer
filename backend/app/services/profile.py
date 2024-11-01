from bson import ObjectId
from app.models.profile import UserProfile
from app.database import db

class ProfileService:
    def __init__(self):
        self.collection = db["profiles"]

    async def create_profile(self, profile: UserProfile):
        result = await self.collection.insert_one(profile.dict())
        created_profile = await self.collection.find_one({"_id": result.inserted_id})
        return UserProfile(**created_profile)

    async def get_profiles(self):
        cursor = self.collection.find()
        profiles = await cursor.to_list(length=None)
        return [UserProfile(**profile) for profile in profiles]

    async def get_profile(self, profile_id: str):
        profile = await self.collection.find_one({"_id": ObjectId(profile_id)})
        if profile:
            return UserProfile(**profile)
        return None

    async def update_profile(self, profile_id: str, updated_profile: UserProfile):
        result = await self.collection.update_one(
            {"_id": ObjectId(profile_id)},
            {"$set": updated_profile.dict(exclude_unset=True)}
        )
        if result.modified_count > 0:
            updated_doc = await self.collection.find_one({"_id": ObjectId(profile_id)})
            return UserProfile(**updated_doc)
        return None

    async def delete_profile(self, profile_id: str):
        result = await self.collection.delete_one({"_id": ObjectId(profile_id)})
        return result.deleted_count > 0

    async def find_profile_by_email(self, email: str):
        profile = await self.collection.find_one({"email": email})
        if profile:
            return UserProfile(**profile)
        return None
