from fastapi import APIRouter, HTTPException, status, Query, Depends
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from app.core.mongodb import get_database
from app.models.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.data.initial_data import INITIAL_PRODUCTS
from app.core.auth import get_current_user


router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products & Inventory CRUD"],
)


# ============================================================================
# HELPERS
# ============================================================================

def serialize_doc(doc: dict) -> Optional[dict]:
    if not doc:
        return None

    doc = dict(doc)

    doc["id"] = str(
        doc.get("_id", doc.get("id", ""))
    )

    doc.pop("_id", None)

    return doc


def get_id_filter(product_id: str) -> dict:
    """
    Supports both MongoDB ObjectId values and legacy string IDs.
    """

    if ObjectId.is_valid(product_id):
        return {
            "$or": [
                {"_id": ObjectId(product_id)},
                {"id": product_id},
                {"_id": product_id},
            ]
        }

    return {
        "$or": [
            {"id": product_id},
            {"_id": product_id},
        ]
    }


# ============================================================================
# 1. READ ALL PRODUCTS
# GET /api/v1/products
# ============================================================================

@router.get(
    "",
    response_model=List[ProductResponse],
)
async def list_products(
    stream: Optional[str] = Query(
        None,
        description="Filter by stream: medical, engineering, general",
    ),

    category: Optional[str] = Query(
        None,
        description="Filter by category",
    ),

    campus: Optional[str] = Query(
        None,
        description="Filter by college / campus",
    ),

    search: Optional[str] = Query(
        None,
        description="Search query in title or description",
    ),

    status_filter: Optional[str] = Query(
        "available",
        alias="status",
        description="Filter by status: available/reserved/sold/all",
    ),

    skip: int = Query(
        0,
        ge=0,
    ),

    limit: int = Query(
        50,
        ge=1,
        le=100,
    ),
):
    db = get_database()

    query = {}

    # Status filter
    if status_filter and status_filter != "all":
        query["status"] = status_filter

    # Stream filter
    if stream and stream != "all":
        query["stream"] = stream

    # Category filter
    if category and category != "all":
        query["category"] = category

    # Campus filter
    if campus and campus != "all":
        query["campus"] = campus

    # Search
    if search:
        query["$or"] = [
            {
                "title": {
                    "$regex": search,
                    "$options": "i",
                }
            },
            {
                "description": {
                    "$regex": search,
                    "$options": "i",
                }
            },
            {
                "category": {
                    "$regex": search,
                    "$options": "i",
                }
            },
        ]

    cursor = (
        db["products"]
        .find(query)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
    )

    products = []

    async for doc in cursor:
        products.append(
            serialize_doc(doc)
        )

    return products


# ============================================================================
# 2. READ SINGLE PRODUCT
# GET /api/v1/products/{product_id}
# ============================================================================

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
async def get_product(
    product_id: str,
):
    db = get_database()

    doc = await db["products"].find_one(
        get_id_filter(product_id)
    )

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Product not found in database",
        )

    return serialize_doc(doc)


# ============================================================================
# 3. CREATE PRODUCT
# POST /api/v1/products
# ============================================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    product: ProductCreate,
    current=Depends(get_current_user),
):
    db = get_database()

    # Convert Pydantic model to MongoDB document
    doc = product.model_dump()

    # ------------------------------------------------------------------------
    # SECURITY:
    # Never trust sellerId sent by the frontend.
    # Always use the authenticated user's ID.
    # ------------------------------------------------------------------------

    current_user_id = str(current["sub"])

    doc["sellerId"] = current_user_id

    # ------------------------------------------------------------------------
    # Seller information
    # ------------------------------------------------------------------------

    existing_seller = doc.get("seller") or {}

    doc["seller"] = {
        **existing_seller,
        "name": current.get(
            "name",
            existing_seller.get(
                "name",
                "Verified Student",
            ),
        ),
        "email": current.get(
            "email",
            existing_seller.get(
                "email",
                "",
            ),
        ),
    }

    # ------------------------------------------------------------------------
    # Product metadata
    # ------------------------------------------------------------------------

    doc["status"] = "available"

    now = datetime.utcnow().isoformat()

    doc["created_at"] = now
    doc["updated_at"] = now

    # ------------------------------------------------------------------------
    # Insert into MongoDB
    # ------------------------------------------------------------------------

    result = await db["products"].insert_one(doc)

    # Fetch the inserted document so frontend gets complete product data
    created_product = await db["products"].find_one(
        {"_id": result.inserted_id}
    )

    return serialize_doc(created_product)


# ============================================================================
# 4. SEED STARTER INVENTORY
# POST /api/v1/products/seed
#
# Keep this route BEFORE /{product_id}.
# Otherwise "seed" could be interpreted as a product ID.
# ============================================================================

@router.post(
    "/seed",
    status_code=status.HTTP_200_OK,
)
async def seed_products(
    force: bool = Query(
        False,
        description="Force re-seed even if products already exist",
    ),
):
    db = get_database()

    count = await db["products"].count_documents({})

    if count > 0 and not force:
        return {
            "message": (
                f"Database already contains {count} items. "
                "Use ?force=true to re-seed."
            ),
            "existing_count": count,
        }

    if force and count > 0:
        await db["products"].delete_many({})

    now = datetime.utcnow().isoformat()

    seeded_items = []

    for item in INITIAL_PRODUCTS:
        entry = dict(item)

        entry["created_at"] = now
        entry["updated_at"] = now

        # Starter products are not assigned to a specific seller.
        entry.setdefault("sellerId", None)

        seeded_items.append(entry)

    if not seeded_items:
        return {
            "message": "No starter products available to seed.",
            "seeded_count": 0,
        }

    result = await db["products"].insert_many(
        seeded_items
    )

    return {
        "message": (
            f"Successfully seeded "
            f"{len(result.inserted_ids)} "
            "campus items into MongoDB!"
        ),
        "seeded_count": len(
            result.inserted_ids
        ),
        "product_ids": [
            str(product_id)
            for product_id in result.inserted_ids
        ],
    }


# ============================================================================
# 5. UPDATE PRODUCT
# PUT /api/v1/products/{product_id}
# ============================================================================

@router.put(
    "/{product_id}",
)
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current=Depends(get_current_user),
):
    db = get_database()

    existing = await db["products"].find_one(
        get_id_filter(product_id)
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Product not found to update",
        )

    current_user_id = str(
        current["sub"]
    )

    existing_seller_id = existing.get(
        "sellerId"
    )

    # ------------------------------------------------------------------------
    # SECURITY:
    # Products without an owner cannot be edited
    # through the seller dashboard.
    # ------------------------------------------------------------------------

    if not existing_seller_id:
        raise HTTPException(
            status_code=403,
            detail=(
                "This product is not assigned "
                "to a seller and cannot be edited."
            ),
        )

    if str(existing_seller_id) != current_user_id:
        raise HTTPException(
            status_code=403,
            detail=(
                "You can only edit your own listings"
            ),
        )

    # ------------------------------------------------------------------------
    # Only update fields explicitly provided by frontend
    # ------------------------------------------------------------------------

    fields = {
        key: value
        for key, value in update_data.model_dump().items()
        if value is not None
    }

    if not fields:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update",
        )

    # Protect ownership fields.
    # sellerId and seller are intentionally NOT accepted
    # through ProductUpdate.
    fields["updated_at"] = (
        datetime.utcnow().isoformat()
    )

    result = await db["products"].update_one(
        get_id_filter(product_id),
        {"$set": fields},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found to update",
        )

    updated_product = await db["products"].find_one(
        get_id_filter(product_id)
    )

    return {
        "product": serialize_doc(
            updated_product
        ),
        "message": (
            "Product updated successfully in MongoDB"
        ),
    }


# ============================================================================
# 6. DELETE PRODUCT
# DELETE /api/v1/products/{product_id}
# ============================================================================

@router.delete(
    "/{product_id}",
)
async def delete_product(
    product_id: str,
    current=Depends(get_current_user),
):
    db = get_database()

    existing = await db["products"].find_one(
        get_id_filter(product_id)
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    current_user_id = str(
        current["sub"]
    )

    existing_seller_id = existing.get(
        "sellerId"
    )

    # ------------------------------------------------------------------------
    # SECURITY:
    # Do not allow users to delete unowned/seeded products.
    # ------------------------------------------------------------------------

    if not existing_seller_id:
        raise HTTPException(
            status_code=403,
            detail=(
                "This product is not assigned "
                "to a seller and cannot be deleted."
            ),
        )

    if str(existing_seller_id) != current_user_id:
        raise HTTPException(
            status_code=403,
            detail=(
                "You can only delete your own listings"
            ),
        )

    result = await db["products"].delete_one(
        get_id_filter(product_id)
    )

    if result.deleted_count != 1:
        raise HTTPException(
            status_code=404,
            detail="Product could not be deleted",
        )

    return {
        "id": product_id,
        "deleted": True,
        "message": (
            "Product deleted from MongoDB successfully"
        ),
    }