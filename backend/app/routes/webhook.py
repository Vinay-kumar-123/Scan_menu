from fastapi import APIRouter, Request, Header, HTTPException
from datetime import datetime, timedelta, timezone
from bson import ObjectId
import json

from app.database.mongodb import db
from app.service.razorpay_service import verify_webhook_signature

router = APIRouter(prefix="/webhook", tags=["Webhook"])


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None)
):
    body = await request.body()

    # =========================
    # ✅ VERIFY SIGNATURE
    # =========================
    if not verify_webhook_signature(body, x_razorpay_signature):
        print("❌ Invalid webhook signature")
        raise HTTPException(400, "Invalid signature")

    payload = json.loads(body)
    event = payload.get("event")

    # केवल payment capture handle करो
    if event != "payment.captured":
        return {"status": "ignored"}

    payment = payload["payload"]["payment"]["entity"]

    payment_id = payment["id"]
    order_id = payment["order_id"]
    user_id = payment["notes"].get("user_id")

    # =========================
    # ❌ SAFETY CHECK
    # =========================
    if not user_id:
        print("❌ user_id missing")
        return {"status": "failed"}

    try:
        user_obj_id = ObjectId(user_id)
    except:
        print("❌ invalid user_id:", user_id)
        return {"status": "failed"}

    # =========================
    # 🔥 DUPLICATE CHECK
    # =========================
    existing = db.payments.find_one({"payment_id": payment_id})

    if existing:
        print("⚠️ Duplicate payment ignored")
        return {"status": "duplicate"}

    # =========================
    # ✅ SAVE PAYMENT LOG
    # =========================
    db.payments.insert_one({
        "payment_id": payment_id,
        "order_id": order_id,
        "user_id": user_id,
        "status": "captured",
        "created_at": datetime.now(timezone.utc)
    })

    # =========================
    # ✅ ACTIVATE SUBSCRIPTION
    # =========================
    expiry = datetime.now(timezone.utc) + timedelta(days=30)

    db.users.update_one(
        {"_id": user_obj_id},
        {"$set": {
            "isSubscribed": True,
            "subscriptionExpiry": expiry
        }}
    )

    print("✅ Subscription activated")

    return {"status": "success"}