from fastapi import APIRouter, Depends, HTTPException, Response
from app.services.resume import ResumeService
import logging
from bson import ObjectId

router = APIRouter()

logger = logging.getLogger(__name__)  # Get the logger

def get_resume_service():
    return ResumeService()
@router.get("/{profile_id}")
async def generate_resume(profile_id: str, service: ResumeService = Depends(ResumeService)) -> Response:
    try:
        logger.info(f"Fetching profile for ID: {profile_id}")
        resume_html = await service.generate_resume(profile_id)

        return Response(content=resume_html, media_type="text/html")  # Return Response with HTML content
    except Exception as e:
        logger.error(f"Error in generate_resume: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")