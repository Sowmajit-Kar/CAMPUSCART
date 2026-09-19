from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SellerInfo(BaseModel):
    model_config = {"extra": "ignore"}

    name: str = "Campus Senior"

    email: Optional[str] = "senior@campus.edu"

    avatar: Optional[str] = (
        "https://images.unsplash.com/"
        "photo-1534528741775-53994a69daeb"
        "?w=160&auto=format&fit=crop&q=80"
    )

    trustScore: Optional[int] = 98

    verified: Optional[bool] = True

    department: Optional[str] = (
        "Computer Science / Medicine"
    )


class ProductBase(BaseModel):
    model_config = {"extra": "ignore"}

    title: str = Field(
        ...,
        example="Lab Notebook"
    )

    category: str = Field(
        ...,
        example="Notes & Material"
    )

    stream: Optional[str] = Field(
        "engineering",
        example="engineering"
    )

    price: float = Field(
        ...,
        example=15.0
    )

    originalPrice: Optional[float] = Field(
        None,
        example=25.0
    )

    mode: Optional[str] = Field(
        "BUY",
        example="BUY"
    )
    # BUY, RENT, EXCHANGE

    condition: Optional[str] = Field(
        "Like New",
        example="Like New (Mint)"
    )

    stock: Optional[int] = Field(
        1,
        example=1
    )

    campus: Optional[str] = Field(
        "Jadavpur University",
        example="Jadavpur University"
    )

    pickupLocation: Optional[str] = Field(
        "Central Library Foyer",
        example="Central Library Foyer"
    )

    image: Optional[str] = Field(
        "https://images.unsplash.com/"
        "photo-1544716278-ca5e3f4abd8c"
        "?w=900&auto=format&fit=crop&q=80"
    )

    description: Optional[str] = Field(
        "",
        example="High quality semester notes and materials."
    )

    # Seller information
    seller: Optional[SellerInfo] = Field(
        default_factory=SellerInfo
    )

    sellerId: Optional[str] = None

    # Rental-specific information
    rentalRate: Optional[str] = None

    # Exchange-specific information
    exchangeWish: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    model_config = {"extra": "ignore"}

    title: Optional[str] = None

    category: Optional[str] = None

    stream: Optional[str] = None

    price: Optional[float] = None

    originalPrice: Optional[float] = None

    mode: Optional[str] = None

    condition: Optional[str] = None

    stock: Optional[int] = None

    status: Optional[str] = None
    # available, reserved, sold

    campus: Optional[str] = None

    pickupLocation: Optional[str] = None

    image: Optional[str] = None

    description: Optional[str] = None

    rentalRate: Optional[str] = None

    exchangeWish: Optional[str] = None


class ProductResponse(ProductBase):
    id: str

    status: str = "available"

    created_at: Optional[str] = None

    updated_at: Optional[str] = None