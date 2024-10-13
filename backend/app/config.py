from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    DATABASE_URL: str
    MONGO_INITDB_DATABASE: str
    OPENAI_API_KEY: str

    CLIENT_ORIGIN: str

    class Config:
        env_file = './.env'


settings = Settings()