import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("campuscart.mongodb")

class MongoDBManager:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at: {settings.MONGO_URI.split('@')[-1] if '@' in settings.MONGO_URI else 'localhost'}")
            self.client = AsyncIOMotorClient(
                settings.MONGO_URI,
                serverSelectionTimeoutMS=5000,
            )
            self.db = self.client[settings.MONGO_DB_NAME]
            return self.db
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB client: {e}")
            raise e

    def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

mongo_manager = MongoDBManager()

def get_database():
    if mongo_manager.db is None:
        return mongo_manager.connect()
    return mongo_manager.db

async def check_mongo_health() -> dict:
    try:
        db = get_database()
        # Ping the admin database
        await db.command("ping")
        # Get count of products
        count = await db["products"].count_documents({})
        return {
            "status": "healthy",
            "database": "MongoDB",
            "db_name": settings.MONGO_DB_NAME,
            "products_count": count,
            "connected": True
        }
    except Exception as e:
        logger.warning(f"MongoDB connection check failed: {e}")
        return {
            "status": "unreachable",
            "database": "MongoDB",
            "error": str(e),
            "connected": False
        }
