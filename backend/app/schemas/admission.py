"""
Admission schemas — input validation blocks OWASP A03 (Injection)
via Pydantic strict typing and field constraints.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import re


class AdmissionCreate(BaseModel):
    guardian_name: str = Field(min_length=2, max_length=100)
    guardian_email: EmailStr
    guardian_phone: str = Field(min_length=9, max_length=20)
    child_name: str = Field(min_length=2, max_length=100)
    child_age: int = Field(ge=3, le=18)
    grade_applying: str = Field(min_length=2, max_length=20)
    message: str | None = Field(default=None, max_length=1000)

    @field_validator("guardian_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\+\(\)]", "", v)
        if not cleaned.isdigit():
            raise ValueError("Phone must contain only digits")
        return v

    @field_validator("guardian_name", "child_name")
    @classmethod
    def no_html(cls, v: str) -> str:
        if any(c in v for c in ["<", ">", "&", '"', "'"]):
            raise ValueError("Invalid characters in name field")
        return v.strip()


class AdmissionResponse(BaseModel):
    id: int
    guardian_name: str
    child_name: str
    grade_applying: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
