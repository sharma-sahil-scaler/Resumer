from app.models.profile import UserProfile
from app.services.openai import OpenAIService

class SuggestionService:
    def __init__(self):
        self.openai_service = OpenAIService()

    def generate_fomo_suggestions(self, user_profile: UserProfile, chat_id: str):
        # Extract relevant information from user profile
        user_skills = user_profile.skills
        user_summary = user_profile.summary
        user_experience = [
            f"Company: {exp.company}\nPosition: {exp.position}\nDuration: {exp.start_date}\nResponsibilities: {', '.join(exp.responsibilities)}\n\n"
            for exp in user_profile.work_experience
        ]
        user_education = [
            f"Institution: {edu.institution}\nDegree: {edu.degree}\nField of Study: {edu.field_of_study}\nDuration: {edu.start_date} - {edu.end_date}\n\n"
            for edu in user_profile.education
        ]

        # Combine user's skills, summary, experience, and education into a single text
        user_text = f"Name: {user_profile.name}\nEmail: {user_profile.email}\nPhone: {user_profile.phone}\nSummary: {user_summary}\nSkills: {', '.join(user_skills)}\n\nWork Experience:\n{''.join(user_experience)}\nEducation:\n{''.join(user_education)}"

        # Prepare the prompt with a system and user role for the AI model
        prompt = f"Given the following resume content:\n\n{user_text}\n\n" \
                 f"Ask the user questions that help them expand on their experience with specific skills, " \
                 f"tools, or frameworks, such as Redux for React."
        
        messages = [
            {"role": "system", "content": "You are an AI companion helping the user improve their resume."},
            {"role": "user", "content": prompt}
        ]

        # Generate FOMO suggestions using the AI model
        response = self.openai_service.generate_response(messages)

        return response