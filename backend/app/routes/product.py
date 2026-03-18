from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from app.core.subscription import subscription_guard
from app.models.product import ProductCreate
from app.database.mongodb import db
from app.core.deps import get_current_user

router = APIRouter(prefix="/product", tags=["Product"])

products = db.products
stores = db.stores


# =========================
# ✅ HELPER: GET USER STORE
# =========================
def get_user_store(user):
    store = stores.find_one({"owner_id": str(user["_id"])})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


# =========================
# ✅ ADD PRODUCT (SUBSCRIPTION PROTECTED)
# =========================
@router.post("/add")
def add_product(data: ProductCreate, user=Depends(subscription_guard)):

    store = get_user_store(user)

    # 🔒 Basic validation
    if len(data.name) > 100:
        raise HTTPException(400, "Product name too long")

    new_product = {
        "name": data.name.strip(),
        "price": float(data.price),
        "stock": int(data.stock),
        "image": data.image,
        "store_id": store["store_id"],
        "created_at": datetime.utcnow()
    }

    products.insert_one(new_product)

    return {"message": "Product added"}


# =========================
# ✅ GET MY PRODUCTS (ADMIN)
# =========================
@router.get("/my-products")
def get_my_products(user=Depends(subscription_guard)):

    store = get_user_store(user)

    items = list(products.find({
        "store_id": store["store_id"]
    }))

    return [
        {
            "id": str(item["_id"]),
            "name": item["name"],
            "price": item["price"],
            "stock": item["stock"]
        }
        for item in items
    ]


# =========================
# ✅ GET PRODUCTS (CUSTOMER SIDE)
# =========================
@router.get("/{store_id}")
def get_products(store_id: str):

    items = list(products.find({
        "store_id": store_id,
        "stock": {"$gt": 0}
    }))

    return [
        {
            "id": str(item["_id"]),
            "name": item["name"],
            "price": item["price"],
            "image": item.get("image")
        }
        for item in items
    ]


# =========================
# ✅ UPDATE PRODUCT (SECURE)
# =========================
@router.put("/update/{product_id}")
def update_product(product_id: str, data: ProductCreate, user=Depends(subscription_guard)):

    store = get_user_store(user)

    product = products.find_one({
        "_id": ObjectId(product_id),
        "store_id": store["store_id"]
    })

    if not product:
        raise HTTPException(404, "Product not found")

    products.update_one(
        {"_id": ObjectId(product_id)},
        {
            "$set": {
                "name": data.name.strip(),
                "price": float(data.price),
                "stock": int(data.stock),
                "image": data.image
            }
        }
    )

    return {"message": "Product updated"}


# =========================
# ✅ DELETE PRODUCT (SECURE)
# =========================
@router.delete("/delete/{product_id}")
def delete_product(product_id: str, user=Depends(subscription_guard)):

    store = get_user_store(user)

    product = products.find_one({
        "_id": ObjectId(product_id),
        "store_id": store["store_id"]
    })

    if not product:
        raise HTTPException(404, "Product not found")

    products.delete_one({"_id": ObjectId(product_id)})

    return {"message": "Product deleted"}


# =========================
# ✅ UPDATE STOCK (SECURE)
# =========================
@router.put("/update-stock/{product_id}")
def update_stock(product_id: str, stock: int, user=Depends(subscription_guard)):

    store = get_user_store(user)

    product = products.find_one({
        "_id": ObjectId(product_id),
        "store_id": store["store_id"]
    })

    if not product:
        raise HTTPException(404, "Product not found")

    if stock < 0:
        raise HTTPException(400, "Stock cannot be negative")

    products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"stock": int(stock)}}
    )

    return {"message": "Stock updated"}