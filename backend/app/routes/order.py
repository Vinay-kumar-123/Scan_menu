
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime,timezone,timedelta
from bson import ObjectId
from pydantic import BaseModel
from app.models.order import OrderCreate
from app.core.subscription import subscription_guard
from app.database.mongodb import db

router = APIRouter(prefix="/order", tags=["Order"])

orders = db.orders
products = db.products
stores = db.stores


# =========================
# ✅ CREATE ORDER (ATOMIC + SAFE)
# =========================
@router.post("/create")
def create_order(data: OrderCreate):

    products_data = []

    # =========================
    # ✅ STEP 1: VALIDATE ALL ITEMS
    # =========================
    for item in data.items:

        product = products.find_one({
            "_id": ObjectId(item.product_id)
        })

        if not product:
            raise HTTPException(404, "Product not found")

        if product["stock"] < item.qty:
            raise HTTPException(
                status_code=400,
                detail=f"Only {product['stock']} {product['name']} available"
            )

        products_data.append(product)

    # =========================
    # ✅ STEP 2: UPDATE STOCK (SAFE)
    # =========================
    updated_items = []
    total = 0

    for item, product in zip(data.items, products_data):

        products.update_one(
            {"_id": product["_id"]},
            {"$inc": {"stock": -item.qty}}   # 🔥 better than set
        )

        updated_items.append({
            "name": product["name"],
            "price": product["price"],
            "qty": item.qty
        })

        total += product["price"] * item.qty

    # =========================
    # ✅ STEP 3: CREATE ORDER
    # =========================
    orders.insert_one({
        "store_id": data.store_id,
        "customer_name": data.customer_name,
        "table": data.table,
        "items": updated_items,
        "total": total,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    })

    return {
        "success": True,
        "message": "Order placed successfully"
    }
# =========================
# ✅ GET MY ORDERS (SUBSCRIPTION PROTECTED)
# =========================
@router.get("/my-orders")
def get_my_orders(user=Depends(subscription_guard)):

    store = stores.find_one({"owner_id": str(user["_id"])})

    if not store:
        raise HTTPException(404, "Store not found")
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    today_end = today_start + timedelta(days=1)
    
    all_orders = list(orders.find({
        "store_id": store["store_id"],
        "created_at": {
            "$gte": today_start,
            "$lt": today_end
        }
    }).sort("created_at", -1))

    return [
        {
            "id": str(order["_id"]),
            "customer_name": order.get("customer_name", "Guest"),
            "table": order.get("table", "N/A"),
            "items": order["items"],
            "total": order["total"],
            "status": order["status"]
        }
        for order in all_orders
    ]


# =========================
# ✅ UPDATE STATUS (SECURE)
# =========================
class StatusUpdate(BaseModel):
    status: str


@router.put("/update-status/{order_id}")
def update_order_status(order_id: str, data: StatusUpdate, user=Depends(subscription_guard)):

    store = stores.find_one({"owner_id": str(user["_id"])})

    if not store:
        raise HTTPException(404, "Store not found")

    order = orders.find_one({
        "_id": ObjectId(order_id),
        "store_id": store["store_id"]
    })

    if not order:
        raise HTTPException(404, "Order not found")

    orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": data.status}}
    )

    return {"message": "Status updated"}


# =========================
# ✅ STATS (SUBSCRIPTION PROTECTED)
# =========================


@router.get("/stats")
def get_stats(user=Depends(subscription_guard)):

    store = stores.find_one({"owner_id": str(user["_id"])})
    if not store:
        raise HTTPException(404, "Store not found")

    # 🔥 Aaj ka time range (UTC)
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    today_end = today_start + timedelta(days=1)

    all_orders = list(orders.find({
        "store_id": store["store_id"],
        "created_at": {
            "$gte": today_start,
            "$lt": today_end
        }
    }))

    total_orders = len(all_orders)
    total_revenue = sum(order.get("total", 0) for order in all_orders)

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }