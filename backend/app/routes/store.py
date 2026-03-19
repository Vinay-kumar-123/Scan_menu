from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
import uuid

from app.models.store import StoreCreate
from app.database.mongodb import db
from app.core.deps import get_current_user

router = APIRouter(prefix="/store", tags=["Store"])

stores = db.stores

@router.post("/create")
def create_store(data: StoreCreate, user=Depends(get_current_user)):

    # check if user already has store
    existing = stores.find_one({"owner_id": str(user["_id"])})
    if existing:
        raise HTTPException(400, "Store already exists")

    store_id = str(uuid.uuid4())[:8]

    store_url = f"https://scanbite-five.vercel.app/store/{store_id}"

    new_store = {
        "name": data.name,
        "location": data.location,
        "store_id": store_id,
        "store_url": store_url,
        "owner_id": str(user["_id"]),
        "created_at": datetime.utcnow()
    }

    stores.insert_one(new_store)

    return {
        "message": "Store created",
        "store_id": store_id,
        "store_url": store_url
    }


@router.get("/my-store")
def get_my_store(user=Depends(get_current_user)):

    store = stores.find_one({
        "owner_id": str(user["_id"])
    })

    if not store:
        raise HTTPException(404, "Store not found")

    return {
        "name": store["name"],
        "location": store["location"],
        "store_id": store["store_id"],
        "store_url": store["store_url"]
    }