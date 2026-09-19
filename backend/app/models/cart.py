from pydantic import BaseModel, Field
from typing import List


class CartItem(BaseModel):
    id: str
    title: str
    price: float = 0
    qty: int = Field(default=1, ge=1)
    image: str | None = None
    seller: str | None = None
    pickupLocation: str | None = None


class CartResponse(BaseModel):
    items: List[CartItem] = []


class CartUpdate(BaseModel):
    items: List[CartItem] = []
