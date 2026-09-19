from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.core.mongodb import get_database
from app.models.wishlist import WishlistUpdate

router = APIRouter(prefix="/api/v1/wishlist", tags=["Wishlist"])

@router.get("")
async def get_wishlist(current=Depends(get_current_user)):
    db = get_database()
    doc = await db["wishlists"].find_one({"user_id": current["sub"]})
    return {"items": doc.get("items", []) if doc else []}

@router.put("")
async def update_wishlist(payload: WishlistUpdate, current=Depends(get_current_user)):
    db = get_database()
    items = [item.model_dump() for item in payload.items]
    await db["wishlists"].update_one({"user_id": current["sub"]}, {"$set": {"items": items}}, upsert=True)
    return {"items": items}
