from motor.motor_asyncio import AsyncIOMotorClient  # Use motor for async
from app.config import settings

client = AsyncIOMotorClient(settings.DATABASE_URL)  # Use AsyncIOMotorClient
print('Connected to MongoDB...')

db = client[settings.MONGO_INITDB_DATABASE]