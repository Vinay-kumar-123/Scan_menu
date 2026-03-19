from fastapi import APIRouter, Request, Header, HTTPException
from datetime import datetime, timedelta, timezone
from app.database.mongodb import db
from bson import ObjectId 
import hmac
import hashlib
import json
from app.core.config import settings

router = APIRouter(prefix="/webhook", tags=["Webhook"])


def verify_webhook_signature(body: bytes, signature: str):
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),   # 🔥 use webhook secret if separate
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None)
):

    body = await request.body()

    # 🔒 verify signature
    if not verify_webhook_signature(body, x_razorpay_signature):
        raise HTTPException(400, "Invalid webhook signature")

    payload = json.loads(body)
    event = payload.get("event")

    # =========================
    # ✅ PAYMENT SUCCESS
    # =========================
    if event == "payment.captured":

        payment = payload["payload"]["payment"]["entity"]

        # 🔥 IMPORTANT: get user_id from notes
        user_id = payment["notes"].get("user_id")

        if user_id:
            expiry = datetime.now(timezone.utc) + timedelta(days=30)

            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {
                        "isSubscribed": True,
                        "subscriptionExpiry": expiry
                    }
                }
            )

    return {"status": "ok"}