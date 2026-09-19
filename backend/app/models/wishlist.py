from pydantic import BaseModel
from typing import List


class WishlistItem(BaseModel):
    id: str
    title: str
    category: str | None = None
    price: float = 0
    mode: str | None = "BUY"
    image: str | None = None
    description: str | None = ""
    neededByMe: bool = False


class WishlistUpdate(BaseModel):
    items: List[WishlistItem] = []
