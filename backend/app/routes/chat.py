import os
import logging
from typing import List, Optional
import httpx
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import settings
from app.core.mongodb import get_database
from app.data.initial_data import INITIAL_PRODUCTS

logger = logging.getLogger("campuscart.chat")

router = APIRouter(
    prefix="/api/v1/chat",
    tags=["CampusBot AI Chat"],
)


class ChatMessage(BaseModel):
    role: str  # "user", "assistant", or "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    campus: Optional[str] = "Jadavpur University"
    user_name: Optional[str] = None


class ChatResponse(BaseModel):
    success: bool
    reply: str
    source: str = "gemini-api"
    items_referenced: Optional[int] = 0


@router.post("", response_model=ChatResponse)
async def chat_with_campus_bot(req: ChatRequest):
    """
    Real-time intelligent conversational assistant for CampusCart powered by Google Gemini API.
    Retrieves live product inventory from MongoDB and injects real-time campus context
    so the bot accurately answers questions about real student listings, prices, and trades.
    """
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GEMINI_API_KEY is not configured in backend environment. Please set GEMINI_API_KEY in your .env file.",
        )

    # 1. Fetch live products from MongoDB
    live_products = []
    try:
        db = get_database()
        if db is not None:
            cursor = db["products"].find(
                {"status": {"$ne": "SOLD"}},
                {"_id": 0}
            ).limit(40)
            live_products = await cursor.to_list(length=40)
    except Exception as err:
        logger.warning(f"Error querying MongoDB products for chat: {err}")

    # Fallback to initial seeded catalog if database has 0 products
    if not live_products:
        live_products = INITIAL_PRODUCTS

    # 2. Build live catalog digest
    catalog_lines = []
    for p in live_products[:35]:
        title = p.get("title", "Item")
        category = p.get("category", "General")
        price = p.get("price", 0)
        orig_price = p.get("originalPrice")
        mode = p.get("mode", "BUY")
        condition = p.get("condition", "Good")
        campus = p.get("campus", "Main Campus")
        pickup = p.get("pickupLocation", "Campus Hub")
        rental = p.get("rentalRate", "")
        stock = p.get("stock", 1)

        extra = f" | Rental: {rental}" if rental else ""
        orig = f" (Original: ₹{orig_price})" if orig_price else ""
        catalog_lines.append(
            f"• {title} [₹{price}{orig}] - Mode: {mode}{extra} | Cat: {category} | Cond: {condition} | Campus: {campus} | Pickup: {pickup} | In Stock: {stock}"
        )

    catalog_context = "\n".join(catalog_lines)

    # 3. Create intelligent system instruction
    student_name = req.user_name or "Student"
    current_campus = req.campus or "Jadavpur University"

    system_instruction = f"""
You are "CampusBot", the AI peer companion on CampusCart — a hyper-local peer-to-peer collegiate marketplace where university students buy, rent, and exchange textbooks, engineering equipment, hostel essentials, electronics, and study notes.

Current Student User: {student_name}
Selected Campus Hub: {current_campus}

REAL-TIME INVENTORY CATALOG (Direct from CampusCart Database):
----------------------------------------------------------------
{catalog_context}
----------------------------------------------------------------

Core Instructions:
1. Ground your answers in the REAL INVENTORY listed above. Whenever the student asks if books, calculators, notes, lab coats, or gadgets are available, refer specifically to matching items from this list with their exact price (₹), condition, and pickup location.
2. If an item is NOT in the catalog above, truthfully say it's not currently listed by students on their campus. Suggest they either check back soon or post a "Wanted / Wishlist" listing in the app. Do NOT invent fake products.
3. Keep answers concise, natural, and friendly with collegiate vibes and fitting emojis (📚, 💻, 🎒, ⚡).
4. Safety & Handshake Protocol: Remind students that all transactions use the "QR Handshake Protocol" where the buyer releases the code ONLY after meeting in person at safe designated spots (like the Library or Student Canteen) and inspecting the item.
5. If the student asks how to sell, tell them to tap the "Sell / List" tab at the top.
"""

    # 4. Construct Gemini API conversation turns
    contents = []

    # Include recent chat history
    if req.history:
        for item in req.history[-6:]:
            role = "model" if item.role in ["assistant", "bot", "model"] else "user"
            contents.append({
                "role": role,
                "parts": [{"text": item.text}]
            })

    # Add the current user query
    contents.append({
        "role": "user",
        "parts": [{"text": req.message}]
    })

    # Prepare Gemini REST payload
    payload = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 600,
            "topP": 0.9,
        }
    }

    # Model priority: try gemini-2.5-flash or gemini-1.5-flash
    model_name = settings.GEMINI_MODEL if hasattr(settings, "GEMINI_MODEL") and settings.GEMINI_MODEL else "gemini-1.5-flash"
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(
                gemini_url,
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            if resp.status_code != 200:
                logger.error(f"Gemini API returned status {resp.status_code}: {resp.text}")
                # Fallback to gemini-2.0-flash if 1.5-flash had an issue
                if model_name != "gemini-2.0-flash":
                    fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
                    resp = await client.post(
                        fallback_url,
                        json=payload,
                        headers={"Content-Type": "application/json"}
                    )

            if resp.status_code != 200:
                error_detail = resp.json().get("error", {}).get("message", resp.text)
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Gemini API Error: {error_detail}"
                )

            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return ChatResponse(
                    success=True,
                    reply="I'm thinking, but couldn't form a response just now. Could you rephrase your question?",
                    items_referenced=len(live_products)
                )

            reply_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if not reply_text:
                reply_text = "I received your query but didn't generate text. Ask me about textbooks, pricing, or hostel gear!"

            return ChatResponse(
                success=True,
                reply=reply_text,
                items_referenced=len(live_products)
            )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error in chat_with_campus_bot")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal chatbot error: {str(exc)}"
        )
