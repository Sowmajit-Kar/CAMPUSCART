from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from app.core.auth import get_current_user
from app.core.mongodb import get_database
from app.models.notification import NotificationResponse

router = APIRouter(
    prefix="/api/v1/notifications",
    tags=["Notifications & Seller Alerts"],
)


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(current=Depends(get_current_user)):
    """Fetch all notifications for the authenticated user (e.g. sold item alerts for sellers)."""
    db = get_database()
    user_id = str(current["sub"])

    cursor = db["notifications"].find(
        {"recipient_id": user_id}
    ).sort("created_at", -1).limit(50)

    results = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        results.append(doc)
    return results


@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str, current=Depends(get_current_user)):
    """Mark a notification as read."""
    db = get_database()
    user_id = str(current["sub"])

    try:
        oid = ObjectId(notification_id)
        query = {"_id": oid, "recipient_id": user_id}
    except Exception:
        query = {"id": notification_id, "recipient_id": user_id}

    result = await db["notifications"].update_one(
        query,
        {"$set": {"read": True, "read_at": datetime.utcnow().isoformat()}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return {"success": True, "id": notification_id, "read": True}


@router.post("/read-all")
async def mark_all_notifications_read(current=Depends(get_current_user)):
    """Mark all notifications as read for current user."""
    db = get_database()
    user_id = str(current["sub"])

    await db["notifications"].update_many(
        {"recipient_id": user_id, "read": False},
        {"$set": {"read": True, "read_at": datetime.utcnow().isoformat()}}
    )

    return {"success": True, "message": "All notifications marked as read"}
