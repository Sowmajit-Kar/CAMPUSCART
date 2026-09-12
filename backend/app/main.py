from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine


app = FastAPI(
    title="CampusCart API",
    description="Backend API for CampusCart",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/api/v1/health")
async def health_check():

    return {
        "status": "healthy",
        "message": "CampusCart API is running",
    }


# --------------------------------------------------
# Database Health Check
# --------------------------------------------------

@app.get("/api/v1/health/database")
async def database_health_check():

    try:

        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "PostgreSQL",
            "connection": "successful",
        }

    except Exception as error:

        return {
            "status": "unhealthy",
            "database": "PostgreSQL",
            "connection": "failed",
            "error": str(error),
        }