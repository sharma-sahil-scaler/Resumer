from pydantic import BaseModel

class ChatRequest(BaseModel):
    chat_id: str  # Unique identifier for each chat session
    message: str

class ChatResponse(BaseModel):
    response: str