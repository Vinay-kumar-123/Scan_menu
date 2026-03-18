from app.database.mongodb import db
from app.core.security import hash_password, verify_password
from datetime import datetime

users = db.users

def create_user(data: dict):
    data["password"] = hash_password(data["password"])
    data["created_at"] = datetime.utcnow()

    result = users.insert_one(data)
    data["_id"] = str(result.inserted_id)

    return data

def authenticate_user(email, password):
    user = users.find_one({"email": email})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    user["_id"] = str(user["_id"])
    return user