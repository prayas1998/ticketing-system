from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
