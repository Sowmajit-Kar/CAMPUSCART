from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    recipient_id: str
    sender_id: Optional[str] = None
    sender_name: Optional[str] = None
    type: str = "ITEM_SOLD"
    title: str
    message: str
    order_id: Optional[str] = None
    product_id: Optional[str] = None
    pickup_token: Optional[str] = None
    read: bool = False
    created_at: str
