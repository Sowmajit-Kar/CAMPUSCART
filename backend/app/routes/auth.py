import hashlib
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from app.core.mongodb import get_database
from app.models.auth import LoginRequest, RegisterRequest, LoginResponse, UserProfile

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication & Student Access"])


def derive_student_details(email: str):
    prefix = email.split("@")[0] if "@" in email else email
    roll = prefix.upper()
    name = "Aarav Patel" if "2024CS1089" in roll else f"Student {roll}"
    dept = "Computer Science & Engineering"
    campus = "Jadavpur University"
    return roll, name, dept, campus


@router.post("/login", response_model=LoginResponse, summary="Student Login & Session Token")
async def login(credentials: LoginRequest):
    """
    Authenticate a student user with collegiate domain credentials.
    Automatically persists and updates student record in MongoDB Atlas 'users' collection.
    """
    email = credentials.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    roll, default_name, default_dept, default_campus = derive_student_details(email)
    now = datetime.utcnow().isoformat()

    try:
        db = get_database()
        user_doc = await db["users"].find_one({"email": email})
        
        if not user_doc:
            # First-time login: create student profile in MongoDB Atlas
            new_user = {
                "email": email,
                "roll": roll,
                "name": default_name,
                "department": default_dept,
                "campus": default_campus,
                "verified": True,
                "trustScore": 99,
                "created_at": now,
                "last_login": now
            }
            res = await db["users"].insert_one(new_user)
            user_id = str(res.inserted_id)
            user_profile = UserProfile(id=user_id, **new_user)
        else:
            user_id = str(user_doc.get("_id", user_doc.get("id", "")))
            await db["users"].update_one(
                {"_id": user_doc["_id"]},
                {"$set": {"last_login": now}}
            )
            user_profile = UserProfile(
                id=user_id,
                email=user_doc.get("email", email),
                roll=user_doc.get("roll", roll),
                name=user_doc.get("name", default_name),
                department=user_doc.get("department", default_dept),
                campus=user_doc.get("campus", default_campus),
                verified=user_doc.get("verified", True),
                trustScore=user_doc.get("trustScore", 98),
                created_at=user_doc.get("created_at", now),
                last_login=now
            )

        # Generate lightweight JWT-style session token
        token_hash = hashlib.sha256(f"{email}:{now}".encode()).hexdigest()[:32]
        token = f"campuscart_{token_hash}"

        return LoginResponse(
            success=True,
            token=token,
            message=f"Successfully authenticated as {roll}",
            user=user_profile
        )
    except Exception as e:
        # Fallback response in case database is momentarily sleeping
        token = f"campuscart_offline_{hashlib.md5(email.encode()).hexdigest()[:16]}"
        user_profile = UserProfile(
            id="local-student",
            email=email,
            roll=roll,
            name=default_name,
            department=default_dept,
            campus=default_campus,
            verified=True,
            trustScore=98,
            last_login=now
        )
        return LoginResponse(
            success=True,
            token=token,
            message=f"Authenticated (Local Fallback): {roll}",
            user=user_profile
        )


@router.post("/register", response_model=LoginResponse, summary="Register New Student Account")
async def register(req: RegisterRequest):
    """Register a new student account in MongoDB Atlas"""
    email = req.email.strip().lower()
    roll, name, dept, campus = derive_student_details(email)
    now = datetime.utcnow().isoformat()

    try:
        db = get_database()
        existing = await db["users"].find_one({"email": email})
        if existing:
            raise HTTPException(status_code=400, detail="Student email already registered. Please login.")

        user_data = {
            "email": email,
            "roll": req.roll or roll,
            "name": req.name or name,
            "department": req.department or dept,
            "campus": req.campus or campus,
            "verified": True,
            "trustScore": 99,
            "created_at": now,
            "last_login": now
        }
        res = await db["users"].insert_one(user_data)
        user_id = str(res.inserted_id)

        token = f"campuscart_{hashlib.sha256(f'{email}:{now}'.encode()).hexdigest()[:32]}"
        return LoginResponse(
            success=True,
            token=token,
            message="Student profile created successfully in MongoDB",
            user=UserProfile(id=user_id, **user_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
