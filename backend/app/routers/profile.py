from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List
from app.models.profile import UserProfile, UserProfileCreate, UserProfileUpdate
from app.services.profile import ProfileService

router = APIRouter()

def get_profile_service():
    return ProfileService()

@router.post("/", response_model=UserProfile)
async def create_profile(profile: UserProfileCreate, service: ProfileService = Depends(get_profile_service)):
    return await service.create_profile(profile)

@router.get("/", response_model=List[UserProfile])
async def get_profiles(service: ProfileService = Depends(get_profile_service)):
    return await service.get_profiles()

@router.get("/{profile_id}", response_model=UserProfile)
async def get_profile(profile_id: str, service: ProfileService = Depends(get_profile_service)):
    profile = await service.get_profile(profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=UserProfile)
async def update_profile(profile_id: str, updated_profile: UserProfileUpdate, service: ProfileService = Depends(get_profile_service)):
    profile = await service.update_profile(profile_id, updated_profile)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.delete("/{profile_id}")
async def delete_profile(profile_id: str, service: ProfileService = Depends(get_profile_service)):
    deleted = await service.delete_profile(profile_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Profile deleted successfully"}

@router.post("/import-resume")
async def import_resume(file: UploadFile = File(...)):
    # Here you would implement resume parsing logic
    # For now, we'll just return a success message
    content = await file.read()
    return {"message": "Resume imported successfully", "filename": file.filename}
