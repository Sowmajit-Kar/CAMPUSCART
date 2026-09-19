from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.core.mongodb import get_database
from app.models.cart import CartUpdate

router = APIRouter(prefix="/api/v1/cart", tags=["Cart"])

@router.get("")
async def get_cart(current=Depends(get_current_user)):
    db = get_database()
    doc = await db["carts"].find_one({"user_id": current["sub"]})
    return {"items": doc.get("items", []) if doc else []}

@router.put("")
async def update_cart(payload: CartUpdate, current=Depends(get_current_user)):
    db = get_database()
    await db["carts"].update_one(
        {"user_id": current["sub"]},
        {"$set": {"items": [item.model_dump() for item in payload.items]}},
        upsert=True,
    )
    return {"items": [item.model_dump() for item in payload.items]}

@router.delete("")
async def clear_cart(current=Depends(get_current_user)):
    db = get_database()
    await db["carts"].update_one({"user_id": current["sub"]}, {"$set": {"items": []}}, upsert=True)
    return {"items": []}
