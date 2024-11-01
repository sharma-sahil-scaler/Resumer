import openai
from app.config import settings

class OpenAIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    def generate_response(self, messages: list[dict]):
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return response.choices[0].message.content.strip()