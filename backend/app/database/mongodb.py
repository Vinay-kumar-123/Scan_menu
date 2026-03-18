from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URI)

database = client[settings.DB_NAME]

db = database
