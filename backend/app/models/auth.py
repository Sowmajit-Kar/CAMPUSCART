from pydantic import BaseModel, Field
from typing import Optional


class LoginRequest(BaseModel):
    model_config = {"extra": "ignore"}
    email: str = Field(..., example="2024cs1089@campus.edu", description="Collegiate student email address")
    password: Optional[str] = Field(default="student123", example="student123", description="Student password")


class RegisterRequest(BaseModel):
    model_config = {"extra": "ignore"}
    email: str = Field(..., example="2024cs1089@campus.edu")
    password: str = Field(default="student123", example="student123")
    name: Optional[str] = Field(default="Aarav Patel", example="Aarav Patel")
    roll: Optional[str] = Field(default="2024CS1089", example="2024CS1089")
    department: Optional[str] = Field(default="Computer Science & Engineering", example="Computer Science & Engineering")
    campus: Optional[str] = Field(default="Jadavpur University", example="Jadavpur University")


class UserProfile(BaseModel):
    model_config = {"extra": "ignore"}
    id: Optional[str] = None
    email: str
    roll: str
    name: str
    department: Optional[str] = "Computer Science & Engineering"
    dept: Optional[str] = "Computer Science & Engineering"
    campus: Optional[str] = "Jadavpur University"
    hostel: Optional[str] = "Hostel 4, Room 218"
    verified: bool = True
    trustScore: int = 98
    created_at: Optional[str] = None
    last_login: Optional[str] = None


class UserResponse(UserProfile):
    pass


class LoginResponse(BaseModel):
    model_config = {"extra": "ignore"}
    success: bool = True
    token: str
    token_type: str = "bearer"
    message: str = "Authentication successful"
    user: UserProfile


class AuthResponse(BaseModel):
    model_config = {"extra": "ignore"}
    success: bool = True
    user: UserProfile
    token: Optional[str] = None
