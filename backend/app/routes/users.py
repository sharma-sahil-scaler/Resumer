from fastapi import APIRouter
from app.models.user import User

router = APIRouter()

@router.get("/users")
async def get_users():
    # Simulated user data
    users = [
        User(id=1, name="John Doe", email="john@example.com"),
        User(id=2, name="Jane Smith", email="jane@example.com"),
    ]
    return users