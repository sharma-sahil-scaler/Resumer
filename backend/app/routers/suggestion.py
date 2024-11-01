from fastapi import APIRouter, Depends
from app.services.suggestion import SuggestionService
from app.services.profile import ProfileService
from app.models.profile import UserProfile

router = APIRouter()

def get_suggestion_service() -> SuggestionService:
    return SuggestionService()

def get_profile_service() -> ProfileService:  # {{ edit_2 }}
    return ProfileService()

@router.get("/{profile_id}")
async def generate_fomo_suggestions(profile_id: str, service: SuggestionService = Depends(get_suggestion_service), profile_service: ProfileService = Depends(get_profile_service)) -> list:  # {{ edit_3 }}
    user_profile: UserProfile = await profile_service.get_profile(profile_id)  # {{ edit_4 }}
    
    if user_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    suggestions = service.generate_fomo_suggestions(user_profile)
    return suggestions