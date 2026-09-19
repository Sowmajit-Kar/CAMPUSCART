from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    model_config = {"extra": "ignore"}
    email: str = Field(..., example="2024cs1089@campus.edu", description="Collegiate student email address")
    password: Optional[str] = Field("student123", example="student123", description="Student password")


class RegisterRequest(BaseModel):
    model_config = {"extra": "ignore"}
    email: str = Field(..., example="2024cs1089@campus.edu")
    password: str = Field("student123", example="student123")
    name: Optional[str] = Field("Aarav Patel", example="Aarav Patel")
    roll: Optional[str] = Field("2024CS1089", example="2024CS1089")
    department: Optional[str] = Field("Computer Science & Engineering", example="Computer Science & Engineering")
    campus: Optional[str] = Field("Jadavpur University", example="Jadavpur University")


class UserProfile(BaseModel):
    id: Optional[str] = None
    email: str
    roll: str
    name: str
    department: str
    campus: str
    verified: bool = True
    trustScore: int = 98
    created_at: Optional[str] = None
    last_login: Optional[str] = None


class LoginResponse(BaseModel):
    success: bool = True
    token: str
    token_type: str = "bearer"
    message: str
    user: UserProfile
