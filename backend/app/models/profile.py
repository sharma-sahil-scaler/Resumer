from pydantic import BaseModel
from typing import List, Optional
from app.schemas.profile import UserProfileSchema, UserProfileCreateSchema, UserProfileUpdateSchema

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None

class WorkExperience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    responsibilities: List[str]

UserProfile = UserProfileSchema
UserProfileCreate = UserProfileCreateSchema
UserProfileUpdate = UserProfileUpdateSchema
