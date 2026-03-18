"use client";

import { subscriptionAPI } from "@/lib/api";

export default function UpgradeButton() {

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpgrade = async () => {

    const ok = await loadRazorpay();
    if (!ok) {
      alert("Razorpay failed");
      return;
    }

    const orderRes = await subscriptionAPI.createOrder();
    const order = orderRes.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      name: "QR Scan & Order",
      description: "Monthly Subscription",

      handler: async function (response) {

        await subscriptionAPI.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        alert("Payment successful ✅");
        window.location.reload();
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-orange-500 text-white px-6 py-2 rounded"
    >
      Upgrade ₹1099 / month
    </button>
  );
}