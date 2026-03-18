import razorpay
import hmac
import hashlib
from app.core.config import settings

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET)
)

def create_order():
    return client.order.create({
        "amount": 1099 * 100,
        "currency": "INR",
        "payment_capture": 1
    })

def verify_signature(order_id, payment_id, signature):
    body = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()
    return expected == signature