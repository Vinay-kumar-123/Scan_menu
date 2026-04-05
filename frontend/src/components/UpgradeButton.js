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
      alert("Razorpay SDK failed ❌");
      return;
    }

    try {
      const orderRes = await subscriptionAPI.createOrder();
      const order = orderRes.data;

      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Login again");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "QR Scan & Order",
        description: "Monthly Subscription",

        // 🔥 VERY IMPORTANT
        notes: {
          user_id: userId,
        },

        handler: function () {
          alert("Payment successful ✅");
          window.location.reload();
        },

        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
    >
      Upgrade ₹499 / month
    </button>
  );
}