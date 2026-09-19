from datetime import datetime
import secrets
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.core.auth import get_current_user
from app.core.mongodb import get_database
from app.core.mongodb import mongo_manager
from app.models.order import CheckoutRequest

router = APIRouter(prefix="/api/v1/orders", tags=["Orders & Checkout"])

@router.get("")
async def list_orders(current=Depends(get_current_user)):
    db = get_database()
    cursor = db["orders"].find({"buyer_id": current["sub"]}).sort("created_at", -1)
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result

@router.post("/checkout")
async def checkout(payload: CheckoutRequest, current=Depends(get_current_user)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    client = mongo_manager.client
    if client is None:
        get_database()
        client = mongo_manager.client
    db = get_database()
    session = await client.start_session()

    try:
        async with session:
            async def transaction(sess):
                order_items = []
                total = 0.0
                pickup_location = "Campus Safe Desk"

                for item in payload.items:
                    try:
                        oid = ObjectId(item.id)
                        product_filter = {"_id": oid}
                    except Exception:
                        product_filter = {"id": item.id}

                    product = await db["products"].find_one(product_filter, session=sess)
                    if not product:
                        raise HTTPException(status_code=404, detail=f"Product {item.id} not found")

                    stock = int(product.get("stock", 0) or 0)
                    if stock < item.qty:
                        raise HTTPException(status_code=409, detail=f"Only {stock} of {product.get('title', item.title)} available")

                    updated = await db["products"].update_one(
                        {**product_filter, "stock": {"$gte": item.qty}},
                        {"$inc": {"stock": -item.qty}, "$set": {"updated_at": datetime.utcnow().isoformat()}},
                        session=sess,
                    )
                    if updated.modified_count != 1:
                        raise HTTPException(status_code=409, detail=f"Stock changed for {product.get('title', item.title)}")

                    snapshot = item.model_dump()
                    snapshot["price"] = float(product.get("price", item.price))
                    snapshot["title"] = product.get("title", item.title)
                    snapshot["image"] = product.get("image", item.image)
                    snapshot["seller"] = (product.get("seller") or {}).get("name", item.seller)
                    snapshot["pickupLocation"] = product.get("pickupLocation", item.pickupLocation)
                    pickup_location = snapshot["pickupLocation"] or pickup_location
                    total += snapshot["price"] * snapshot["qty"]
                    order_items.append(snapshot)

                order = {
                    "buyer_id": current["sub"],
                    "buyer": {"email": current["email"]},
                    "created_at": datetime.utcnow().isoformat(),
                    "status": "Pending Pickup",
                    "pickupToken": secrets.token_hex(3).upper(),
                    "pickupLocation": pickup_location,
                    "items": order_items,
                    "total": total,
                }
                inserted = await db["orders"].insert_one(order, session=sess)
                await db["carts"].update_one({"user_id": current["sub"]}, {"$set": {"items": []}}, upsert=True, session=sess)
                order["id"] = str(inserted.inserted_id)
                return order

            return await session.with_transaction(transaction)
    finally:
        pass

@router.post("/{order_id}/cancel")
async def cancel_order(order_id: str, current=Depends(get_current_user)):
    db = get_database()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order id")

    order = await db["orders"].find_one({"_id": oid, "buyer_id": current["sub"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.get("status") == "Cancelled":
        return {"id": order_id, "status": "Cancelled"}
    if order.get("status") in {"Completed", "Ready for Pickup"}:
        raise HTTPException(status_code=409, detail="This order can no longer be cancelled")

    async with await mongo_manager.client.start_session() as session:
        async def transaction(sess):
            for item in order.get("items", []):
                try:
                    product_filter = {"_id": ObjectId(item["id"])}
                except Exception:
                    product_filter = {"id": item["id"]}
                await db["products"].update_one(product_filter, {"$inc": {"stock": int(item["qty"])}} , session=sess)
            await db["orders"].update_one({"_id": oid}, {"$set": {"status": "Cancelled", "cancelledAt": datetime.utcnow().isoformat()}}, session=sess)
        await session.with_transaction(transaction)

    return {"id": order_id, "status": "Cancelled"}
