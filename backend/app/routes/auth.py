from datetime import datetime
from fastapi import APIRouter, HTTPException, Response, status, Depends, Request

from app.core.auth import get_current_user, create_session_token, hash_password, verify_password
from app.core.mongodb import get_database
from app.models.auth import LoginRequest, AuthResponse, UserResponse

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def serialize_user(doc: dict) -> dict:
    return {
        "id": str(doc.get("_id", doc.get("id", ""))),
        "email": doc["email"],
        "roll": doc.get("roll", doc["email"].split("@")[0].upper()),
        "name": doc.get("name", "Verified Student"),
        "dept": doc.get("dept", "Computer Science & Engineering"),
        "hostel": doc.get("hostel", "Campus Residence"),
    }


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response, request: Request):
    email = payload.email.strip().lower()
    if not email.endswith("@campus.edu"):
        raise HTTPException(status_code=400, detail="Use your college @campus.edu email")

    db = get_database()
    user = await db["users"].find_one({"email": email})

    if not user:
        roll = email.split("@")[0].upper()
        user = {
            "email": email,
            "roll": roll,
            "name": "Aarav Patel" if roll == "2024CS1089" else "Verified Student",
            "dept": "Computer Science & Engineering",
            "hostel": "Hostel 4, Room 218",
            "password_hash": hash_password(payload.password),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        result = await db["users"].insert_one(user)
        user["_id"] = result.inserted_id
    elif not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user_data = serialize_user(user)
    token = create_session_token(user_data["id"], user_data["email"], user_data["name"])
    is_production = request.url.scheme == "https"

    response.set_cookie(
    key="campuscart_session",
    value=token,
    max_age=60 * 60 * 24 * 7,
    httponly=True,
    secure=is_production,
    samesite="none" if is_production else "lax",
    path="/",
)


@router.get("/me", response_model=AuthResponse)
async def me(current=Depends(get_current_user)):
    db = get_database()
    user = await db["users"].find_one({"_id": __import__("bson").ObjectId(current["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return {"user": serialize_user(user)}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
    "campuscart_session",
    path="/",
    secure=True,
    httponly=True,
    samesite="none",
)
    return {"message": "Logged out successfully"}
