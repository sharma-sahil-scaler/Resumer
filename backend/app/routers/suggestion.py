from fastapi import APIRouter, Depends
from app.services.suggestion import SuggestionService
from app.models.profile import UserProfile

router = APIRouter()

def get_suggestion_service() -> SuggestionService:
    return SuggestionService()

@router.post("/")
async def generate_fomo_suggestions(user_profile: UserProfile, service: SuggestionService = Depends(get_suggestion_service)) -> dict:
    suggestions = service.generate_fomo_suggestions(user_profile)
    return {"fomo_suggestions": suggestions}