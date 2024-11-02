from app.models.profile import UserProfile
from app.services.openai import OpenAIService

class SuggestionService:
    def __init__(self):
        self.openai_service = OpenAIService()

    def generate_fomo_suggestions(self, user_profile: UserProfile, section: str):
        # Extract user name and build profile context
        user_name = user_profile.name
        full_profile_context = (
            f"**Name:** {user_name}\n"
            f"**Summary:** {user_profile.summary}\n"
            f"**Skills:** {', '.join(user_profile.skills)}\n"
            f"**Work Experience:**\n" + "\n\n".join([
                f"- **Company:** {exp.company}\n  **Position:** {exp.position}\n  **Responsibilities:** {', '.join(exp.responsibilities)}"
                for exp in user_profile.work_experience
            ])
        )

        # Section-specific guidance
        section_goals = {
            "summary": (
                "encourage the user to add specific achievements, skills, or goals to enhance the summary. "
                "After a few questions, feel free to check if they’re satisfied with the summary."
            ),
            "work_experience": (
                "ask about specific work experiences, projects, or measurable impacts to enhance detail. "
                "Periodically check if they are ready to move on to the next section."
            ),
            "skills": (
                "suggest they elaborate on their key skills, particularly those used in real-world projects. "
                "After a few exchanges, feel free to check in and ask if they’re satisfied with this section."
            ),
        }

        # Prompt instructing the AI to act as a mentor and periodically check satisfaction
        prompt = (
            f"As a resume-building mentor, guide {user_name} through the **{section}** section. "
            f"Use Markdown formatting to keep responses clear and structured. Here’s {user_name}'s full profile for context:\n\n"
            f"{full_profile_context}\n\n"
            f"Focus on one question or suggestion at a time, following the goal of {section_goals[section]}. "
            f"Periodically, feel free to check if {user_name} is satisfied with this section or if they’d like more refinement. "
            f"Include 1-2 short response options to help {user_name} continue the conversation smoothly."
        )

        # Messages for OpenAI API
        messages = [
            {"role": "system", "content": "You are a supportive mentor who provides one question or suggestion at a time and checks for user satisfaction when appropriate."},
            {"role": "user", "content": prompt}
        ]

        # Generate the response using OpenAI
        response = self.openai_service.generate_response(messages)
        return response

    def generate_dynamic_response(self, messages: list[dict]):
        """Generate a dynamic response using OpenAI with Markdown formatting and periodic satisfaction checks."""
        follow_up_prompt = (
            "Continue to guide the user with one specific question or suggestion, focusing on only one aspect at a time. "
            "After a few exchanges, check if the user is satisfied with this section or if they’d like to continue refining it."
        )

        messages.append({"role": "system", "content": follow_up_prompt})
        response = self.openai_service.generate_response(messages)
        return response