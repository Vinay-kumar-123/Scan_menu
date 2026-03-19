from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from pymongo.errors import DuplicateKeyError

from app.models.user import UserCreate, UserLogin
from app.database.mongodb import db
from app.core.security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

users = db["users"]


# =========================
# ✅ SIGNUP (FINAL)
# =========================
@router.post("/signup")
def signup(user: UserCreate):

    # 🔥 normalize email
    email = user.email.lower()

    new_user = {
        "name": user.name,
        "email": email,
        "phone": user.phone,
        "password": hash_password(user.password),
        "trialStart": datetime.now(timezone.utc),
        "trialEnd": datetime.now(timezone.utc) + timedelta(days=7),
        "isSubscribed": False,
        "subscriptionExpiry": None,
        "created_at": datetime.now(timezone.utc)
    }

    try:
        result = users.insert_one(new_user)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email or phone already exists"
        )

    token = create_token({
        "user_id": str(result.inserted_id)
    })

    return {
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": email
        },
        "has_store": False
    }


# =========================
# ✅ LOGIN (FINAL)
# =========================
@router.post("/login")
def login(data: UserLogin):

    email = data.email.lower()

    user = users.find_one({"email": email})

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "user_id": str(user["_id"])
    })

    store = db.stores.find_one({
        "owner_id": str(user["_id"])
    })

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        },
        "has_store": True if store else False
    }