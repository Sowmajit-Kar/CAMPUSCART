from pydantic import BaseModel, Field
from typing import List, Optional


class OrderItem(BaseModel):
    id: str
    title: str
    price: float
    qty: int = Field(ge=1)
    image: Optional[str] = None
    seller: Optional[str] = None
    pickupLocation: Optional[str] = None


class CheckoutRequest(BaseModel):
    items: List[OrderItem]


class CancelOrderRequest(BaseModel):
    reason: Optional[str] = None
