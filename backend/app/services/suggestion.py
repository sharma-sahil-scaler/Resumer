from app.models.profile import UserProfile
from app.services.opneai import OpenAIService

class SuggestionService:
    def __init__(self):
        self.openai_service = OpenAIService()

    def generate_fomo_suggestions(self, user_profile: UserProfile):
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

        # Prepare the prompt for the AI model
        prompt = f"Generate a list of 7 thought-provoking questions that highlight the skills, experiences, or industry trends the user may be missing out on. The questions should create a sense of FOMO (Fear of Missing Out) and encourage the user to reflect on their current skills and experiences compared to industry standards.\n\n" \
                 f"Include 2 specific questions related to their work experience with FastAPI and load testing, emphasizing the importance of these skills in the current job market.\n\n" \
                 f"Additionally, generate 3 questions that suggest emerging technologies, frameworks, or best practices that are gaining popularity in the industry and how they can benefit the user's career growth.\n\n" \
                 f"User Profile:\n{user_text}\n\nQuestions: Please provide only the questions without any additional text."

        # Generate FOMO suggestions using the AI model
        fomo_suggestions = self.openai_service.generate_response(prompt)


        questions = [question for question in fomo_suggestions.split('\n') if question.strip()]

        return questions