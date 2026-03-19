from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from app.models.user import UserCreate, UserLogin
from app.database.mongodb import db
from app.core.security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

users = db["users"]


# =========================
# ✅ SIGNUP
# =========================
@router.post("/signup")
def signup(user: UserCreate):

    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hash_password(user.password),
       "trialStart": datetime.now(timezone.utc),
       "trialEnd": datetime.now(timezone.utc) + timedelta(days=7),
        "isSubscribed": False,
        "subscriptionExpiry": None,
        "created_at": datetime.now(timezone.utc)
    }

    result = users.insert_one(new_user)

    token = create_token({
        "user_id": str(result.inserted_id)
    })

    return {
        "token": token,
        "user": {
            "name": user.name,
            "email": user.email
        },
        "has_store": False   # 🔥 IMPORTANT
    }


# =========================
# ✅ LOGIN
# =========================
@router.post("/login")
def login(data: UserLogin):

    user = users.find_one({"email": data.email})

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