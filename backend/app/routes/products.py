from fastapi import APIRouter, HTTPException, status, Query
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from app.core.mongodb import get_database
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from app.data.initial_data import INITIAL_PRODUCTS

router = APIRouter(prefix="/api/v1/products", tags=["Products & Inventory CRUD"])


def serialize_doc(doc: dict) -> dict:
    if not doc:
        return None
    doc["id"] = str(doc.get("_id", doc.get("id", "")))
    if "_id" in doc:
        del doc["_id"]
    return doc


def get_id_filter(product_id: str) -> dict:
    if ObjectId.is_valid(product_id):
        return {"$or": [{"_id": ObjectId(product_id)}, {"id": product_id}, {"_id": product_id}]}
    return {"$or": [{"id": product_id}, {"_id": product_id}]}


# -----------------------------------------------------------------------------
# 1. READ ALL PRODUCTS (GET /api/v1/products)
# -----------------------------------------------------------------------------
@router.get("", response_model=List[ProductResponse])
async def list_products(
    stream: Optional[str] = Query(None, description="Filter by stream: medical, engineering, general"),
    category: Optional[str] = Query(None, description="Filter by category"),
    campus: Optional[str] = Query(None, description="Filter by college / campus"),
    search: Optional[str] = Query(None, description="Search query in title or description"),
    status_filter: Optional[str] = Query("available", alias="status", description="Filter by status (available/reserved/sold)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    db = get_database()
    query = {}

    if status_filter and status_filter != "all":
        query["status"] = status_filter
    if stream and stream != "all":
        query["stream"] = stream
    if category and category != "all":
        query["category"] = category
    if campus and campus != "all":
        query["campus"] = campus
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]

    cursor = db["products"].find(query).skip(skip).limit(limit)
    products = []
    async for doc in cursor:
        products.append(serialize_doc(doc))
    return products


# -----------------------------------------------------------------------------
# 2. READ SINGLE PRODUCT (GET /api/v1/products/{product_id})
# -----------------------------------------------------------------------------
@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    db = get_database()
    doc = await db["products"].find_one(get_id_filter(product_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found in database")
    return serialize_doc(doc)


# -----------------------------------------------------------------------------
# 3. CREATE PRODUCT (POST /api/v1/products)
# -----------------------------------------------------------------------------
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    db = get_database()
    doc = product.dict()
    doc["status"] = "available"
    doc["created_at"] = datetime.utcnow().isoformat()
    doc["updated_at"] = datetime.utcnow().isoformat()

    result = await db["products"].insert_one(doc)
    return {
        "id": str(result.inserted_id),
        "title": doc["title"],
        "price": doc["price"],
        "status": doc["status"],
        "message": "Product created and stored successfully in MongoDB"
    }


# -----------------------------------------------------------------------------
# 4. UPDATE PRODUCT (PUT /api/v1/products/{product_id})
# -----------------------------------------------------------------------------
@router.put("/{product_id}")
async def update_product(product_id: str, update_data: ProductUpdate):
    db = get_database()
    fields = {k: v for k, v in update_data.dict().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    fields["updated_at"] = datetime.utcnow().isoformat()

    result = await db["products"].update_one(
        get_id_filter(product_id),
        {"$set": fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found to update")

    return {
        "id": product_id,
        "updated_fields": list(fields.keys()),
        "message": "Product updated successfully in MongoDB"
    }


# -----------------------------------------------------------------------------
# 5. DELETE PRODUCT (DELETE /api/v1/products/{product_id})
# -----------------------------------------------------------------------------
@router.delete("/{product_id}")
async def delete_product(product_id: str):
    db = get_database()
    result = await db["products"].delete_one(get_id_filter(product_id))
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found to delete")

    return {
        "id": product_id,
        "message": "Product deleted from MongoDB successfully"
    }


# -----------------------------------------------------------------------------
# 6. SEED STARTER INVENTORY (POST /api/v1/products/seed)
# -----------------------------------------------------------------------------
@router.post("/seed", status_code=status.HTTP_200_OK)
async def seed_products(force: bool = Query(False, description="Force re-seed even if products already exist")):
    db = get_database()
    count = await db["products"].count_documents({})

    if count > 0 and not force:
        return {
            "message": f"Database already contains {count} items. Use ?force=true to re-seed.",
            "existing_count": count
        }

    if force and count > 0:
        await db["products"].delete_many({})

    # Insert initial starter items
    now = datetime.utcnow().isoformat()
    seeded_items = []
    for item in INITIAL_PRODUCTS:
        entry = dict(item)
        entry["created_at"] = now
        entry["updated_at"] = now
        seeded_items.append(entry)

    result = await db["products"].insert_many(seeded_items)
    return {
        "message": f"Successfully seeded {len(result.inserted_ids)} campus items into MongoDB!",
        "seeded_count": len(result.inserted_ids),
        "product_ids": [str(i) for i in result.inserted_ids]
    }
