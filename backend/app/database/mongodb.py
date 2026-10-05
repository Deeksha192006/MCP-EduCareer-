import os
import logging
from pymongo import MongoClient
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

class Database:
    client = None
    db = None
    is_memory_fallback = False
    memory_store = {
        "users": [],
        "students": [],
        "assessments": [],
        "predictions": [],
        "courses": [],
        "recommendations": [],
        "recommendation_history": [],
        "counsellor_reviews": [],
        "feedback": [],
        "cse_assessments": [],
        "ece_assessments": []
    }

db_instance = Database()

def connect_to_mongo():
    try:
        db_instance.client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=1000)
        db_instance.client.admin.command('ping')
        db_instance.db = db_instance.client[settings.DATABASE_NAME]
        db_instance.is_memory_fallback = False
        logger.info(f"Connected successfully to MongoDB at {settings.MONGO_URI}")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Using In-Memory Fallback Store for demonstration.")
        db_instance.is_memory_fallback = True
    
    from seed import seed_demo_data
    seed_demo_data()

def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection.")

def get_database():
    if db_instance.client is None and not db_instance.is_memory_fallback:
        connect_to_mongo()
    return db_instance
