
"use client";

import { useEffect, useState } from "react";
import UpgradeButton from "@/components/UpgradeButton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Table,
  IndianRupee,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [subInfo, setSubInfo] = useState(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  useEffect(() => {
    if (subInfo?.plan !== "NONE") {
      fetchOrders();
      const interval = setInterval(fetchOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [subInfo]);

  const fetchSubscription = async () => {
    const res = await fetch(
      "https://scan-menu-fastapi.onrender.com/subscription/info",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setSubInfo(data);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "https://scan-menu-fastapi.onrender.com/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 403) return;

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(
      `https://scan-menu-fastapi.onrender.com/order/update-status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchOrders();
  };

  if (subInfo?.plan === "NONE") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
          Upgrade required to view orders 🚀
        </h2>
        <UpgradeButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-6 md:px-8">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart size={22} /> Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Live incoming orders (auto refresh)
        </p>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No orders yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {orders.map((order) => (
            <Card
              key={order.id}
              className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 flex justify-between items-center">
                  
                  <span className="flex items-center gap-1">
                    <Table size={14} /> Table {order.table}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {order.status}
                  </span>

                </CardTitle>

                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={12} /> {order.customer_name}
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">

                {/* ITEMS */}
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-gray-700"
                    >
                      <span>{item.name}</span>
                      <span>x {item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <IndianRupee size={14} /> {order.total}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">

                  <Button
                    variant="secondary"
                    className="flex-1 gap-1 hover:scale-[1.02] transition"
                    onClick={() => updateStatus(order.id, "preparing")}
                  >
                    <Clock size={14} /> Preparing
                  </Button>

                  <Button
                    className="flex-1 gap-1 hover:scale-[1.02] transition"
                    onClick={() => updateStatus(order.id, "completed")}
                  >
                    <CheckCircle size={14} /> Done
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}