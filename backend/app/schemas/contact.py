from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    id: int
    name: str
    subject: str
    created_at: datetime

    model_config = {"from_attributes": True}
