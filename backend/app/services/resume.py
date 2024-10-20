from app.models.profile import UserProfile
from app.services.profile import ProfileService 
from jinja2 import Environment, FileSystemLoader
import logging


class ResumeService:
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader('app/templates'))
        self.profile_service = ProfileService()

    async def generate_resume(self, profile_id: str) -> str:
        user_profile: UserProfile = await self.profile_service.get_profile(profile_id)

        if user_profile is None:
            logging.error("User profile not found")  # Log error if profile is not found
            raise ValueError("User profile not found")

        # Log the user profile data
        logging.info(f"User profile retrieved: {user_profile}")

        # Load the HTML template
        template = self.env.get_template('resume_template.html')

        # Render the template with user profile data
        resume_html = template.render(
            name=user_profile.name,
            email=user_profile.email,
            phone=user_profile.phone,
            education=user_profile.education,
            experience=user_profile.work_experience,
            skills=user_profile.skills,
            summary=user_profile.summary
        )

        return resume_html