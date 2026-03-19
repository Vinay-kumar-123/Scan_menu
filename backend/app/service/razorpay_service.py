import razorpay
import hmac
import hashlib
from app.core.config import settings

# ✅ Razorpay client
client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET)
)

# ✅ CREATE ORDER
def create_order():
    return client.order.create({
        "amount": 1099 * 100,
        "currency": "INR",
        "payment_capture": 1
    })


# ✅ VERIFY CHECKOUT (optional)
def verify_signature(order_id, payment_id, signature):
    body = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()
    return expected == signature


# 🔥🔥 WEBHOOK VERIFY (IMPORTANT)
def verify_webhook_signature(body: bytes, signature: str):
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)