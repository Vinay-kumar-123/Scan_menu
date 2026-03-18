from datetime import datetime, timezone
from fastapi import Depends, HTTPException
from app.core.deps import get_current_user

def subscription_guard(user=Depends(get_current_user)):

    now = datetime.now(timezone.utc)

    # 🔹 Trial
    trial_end = user.get("trialEnd")
    if trial_end:
        if trial_end.tzinfo is None:
            trial_end = trial_end.replace(tzinfo=timezone.utc)

        if now <= trial_end:
            return user

    # 🔹 Paid
    expiry = user.get("subscriptionExpiry")
    if user.get("isSubscribed") and expiry:
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if now <= expiry:
            return user

    # ❌ BLOCK
    raise HTTPException(
        status_code=403,
        detail="Subscription expired. Please upgrade."
    )