from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

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

class UserProfileSchema(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    phone: str
    summary: Optional[str] = None
    education: List[Education]
    work_experience: List[WorkExperience]
    skills: List[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "phone": "123-456-7890",
                "summary": "Experienced software developer",
                "education": [
                    {
                        "institution": "University of Example",
                        "degree": "Bachelor of Science",
                        "field_of_study": "Computer Science",
                        "start_date": "2015-09-01",
                        "end_date": "2019-05-31"
                    }
                ],
                "work_experience": [
                    {
                        "company": "Tech Corp",
                        "position": "Software Engineer",
                        "start_date": "2019-06-01",
                        "end_date": None,
                        "responsibilities": [
                            "Develop web applications",
                            "Optimize database queries"
                        ]
                    }
                ],
                "skills": ["Python", "FastAPI", "MongoDB"]
            }
        }

class UserProfileCreateSchema(BaseModel):
    name: str
    email: str
    phone: str
    summary: Optional[str] = None
    education: List[Education]
    work_experience: List[WorkExperience]
    skills: List[str]

class UserProfileUpdateSchema(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    summary: Optional[str]
    education: Optional[List[Education]]
    work_experience: Optional[List[WorkExperience]]
    skills: Optional[List[str]]
