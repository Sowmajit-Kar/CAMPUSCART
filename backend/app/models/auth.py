from pydantic import BaseModel, Field
from typing import Optional


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(default="campuscart-demo-password", min_length=1)


class UserResponse(BaseModel):
    id: str
    email: str
    roll: str
    name: str
    dept: str
    hostel: str


class AuthResponse(BaseModel):
    user: UserResponse
