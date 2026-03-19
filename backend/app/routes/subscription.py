from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone
from app.database.mongodb import db
from app.core.deps import get_current_user
from app.service.razorpay_service import create_order, verify_signature

router = APIRouter(prefix="/subscription", tags=["Subscription"])


@router.post("/create-order")
def create_payment_order(user=Depends(get_current_user)):
    
    return create_order(str(user["_id"]))   # 🔥 pass user_id

@router.post("/verify-payment")
def verify_payment(data: dict, user=Depends(get_current_user)):

    ok = verify_signature(
        data["razorpay_order_id"],
        data["razorpay_payment_id"],
        data["razorpay_signature"]
    )

    if not ok:
        raise HTTPException(400, "Payment verification failed")

    expiry = datetime.now(timezone.utc) + timedelta(days=30)

    db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "isSubscribed": True,
            "subscriptionExpiry": expiry
        }}
    )

    return {"message": "Subscription activated"}

from datetime import datetime, timezone


@router.get("/info")
def subscription_info(user=Depends(get_current_user)):

    now = datetime.now(timezone.utc)

    trial_end = user.get("trialEnd")
    expiry = user.get("subscriptionExpiry")

    # 🔥 FIX: make timezone aware
    if trial_end and trial_end.tzinfo is None:
        trial_end = trial_end.replace(tzinfo=timezone.utc)

    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    # 🟡 TRIAL
    if trial_end and now <= trial_end:
        days = (trial_end - now).days
        return {"plan": "TRIAL", "days_left": max(days, 0)}

    # 🟢 PREMIUM
    if user.get("isSubscribed") and expiry and now <= expiry:
        days = (expiry - now).days
        return {"plan": "PREMIUM", "days_left": max(days, 0)}

    # 🔴 EXPIRED
    return {"plan": "NONE", "days_left": 0}