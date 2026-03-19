

"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";
import UpgradeButton from "@/components/UpgradeButton";
import SubscriptionBadge from "@/components/SubscriptionBadge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Store,
  Package,
  ShoppingCart,
  PlusCircle,
  IndianRupee,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [subInfo, setSubInfo] = useState(null);
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");

    try {
      const [storeRes, statsRes, subRes] = await Promise.all([
        fetch("https://scan-menu-fastapi.onrender.com/store/my-store", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://scan-menu-fastapi.onrender.com/order/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://scan-menu-fastapi.onrender.com/subscription/info", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!storeRes.ok) {
        router.push("/create-store");
        return;
      }

      const storeData = await storeRes.json();
      const statsData = await statsRes.json();
      const subData = await subRes.json();

      setStore(storeData);
      setStats(statsData);
      setSubInfo(subData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-6 md:px-8">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <SubscriptionBadge info={subInfo} />
          {subInfo?.plan === "NONE" && <UpgradeButton />}
        </div>
      </div>

      {/* ALERT */}
      {subInfo?.plan === "NONE" && (
        <div className="mb-5 bg-red-100 text-red-600 text-sm font-medium text-center py-2 rounded-lg">
          Your subscription expired 🚀 Upgrade to continue
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* STORE */}
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white">
          <CardHeader className="flex flex-row items-center gap-2">
            <Store className="text-orange-500" size={18} />
            <CardTitle className="text-base md:text-lg text-gray-800">
              {store?.name || "Store Name"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center text-center gap-2">
            <p className="text-sm text-gray-500">
              {store?.location || "Location"}
            </p>

            <div className="p-3 bg-gray-50 rounded-xl shadow-inner">
              <QRCodeCanvas value={store?.store_url || ""} size={120} />
            </div>

            <p className="text-xs text-gray-400 break-all">
              {store?.store_url}
            </p>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white">
          <CardHeader>
            <CardTitle className="text-base md:text-lg text-gray-800">
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">

            <Button
              className="justify-start gap-2 text-sm font-medium hover:scale-[1.02] transition"
              onClick={() =>
                subInfo?.plan === "NONE"
                  ? alert("Upgrade required")
                  : router.push("/admin/add-product")
              }
            >
              <PlusCircle size={16} />
              Add Product
            </Button>

            <Button
              variant="secondary"
              className="justify-start gap-2 text-sm font-medium hover:scale-[1.02] transition"
              onClick={() =>
                subInfo?.plan === "NONE"
                  ? alert("Upgrade required")
                  : router.push("/admin/products")
              }
            >
              <Package size={16} />
              View Products
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-2 text-sm font-medium hover:scale-[1.02] transition"
              onClick={() =>
                subInfo?.plan === "NONE"
                  ? alert("Upgrade required")
                  : router.push("/admin/orders")
              }
            >
              <ShoppingCart size={16} />
              View Orders
            </Button>

          </CardContent>
        </Card>

        {/* STATS */}
        <Card className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white">
          <CardHeader>
            <CardTitle className="text-base md:text-lg text-gray-800">
              Stats Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">

            <div className="flex items-center justify-between bg-orange-50 p-3 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <h3 className="text-lg font-bold text-gray-900">
                  {stats.total_orders}
                </h3>
              </div>
              <ShoppingCart className="text-orange-500" />
            </div>

            <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <h3 className="text-lg font-bold text-gray-900">
                  ₹{stats.total_revenue}
                </h3>
              </div>
              <IndianRupee className="text-green-600" />
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}