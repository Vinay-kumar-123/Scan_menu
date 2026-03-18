"use client";

import { Crown, Timer } from "lucide-react";

export default function SubscriptionBadge({ info }) {
  if (!info) return null;

  // 🟢 PREMIUM
  if (info.plan === "PREMIUM") {
    return (
      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
        <Crown size={16} />
        Premium {info.days_left ? `• ${info.days_left} days left` : ""}
      </div>
    );
  }

  // 🟡 TRIAL
  if (info.plan === "TRIAL") {
    return (
      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
        <Timer size={16} />
        Trial {info.days_left ? `• ${info.days_left} days left` : ""}
      </div>
    );
  }

  // 🔴 EXPIRED
  return (
    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
      <Crown size={16} />
      Upgrade Required
    </div>
  );
}