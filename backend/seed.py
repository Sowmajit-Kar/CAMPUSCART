"""
CampusCart Database Seeder
Runs locally or on server to populate MongoDB Atlas with initial campus marketplace items.
Usage:
    python seed.py
"""
import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from app.core.mongodb import get_database, mongo_manager
from app.data.initial_data import INITIAL_PRODUCTS


async def main():
    print("🌱 CampusCart MongoDB Seeder Starting...")
    try:
        db = get_database()
        # Test connection
        await db.command("ping")
        print("✅ MongoDB connection verified.")

        existing = await db["products"].count_documents({})
        print(f"📦 Current products in collection: {existing}")

        now = datetime.utcnow().isoformat()
        records = []
        for p in INITIAL_PRODUCTS:
            item = dict(p)
            item["created_at"] = now
            item["updated_at"] = now
            records.append(item)

        result = await db["products"].insert_many(records)
        print(f"🎉 Successfully inserted {len(result.inserted_ids)} starter products into MongoDB!")
        print("MongoDB IDs:")
        for idx, obj_id in enumerate(result.inserted_ids):
            print(f"  [{idx + 1}] {INITIAL_PRODUCTS[idx]['title'][:40]}... -> {obj_id}")

    except Exception as e:
        print(f"❌ Seeding failed: {e}")
    finally:
        mongo_manager.close()
        print("🔌 Connection closed.")


if __name__ == "__main__":
    asyncio.run(main())
