import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "CampusCart API"
    APP_VERSION: str = "1.0.0"

    # MongoDB Atlas / Local URI
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "campuscart_db")

    # Optional Relational DB (if used)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./campuscart.db")

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "campuscart_super_secret_jwt_key_2026")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS Frontend Domain
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()