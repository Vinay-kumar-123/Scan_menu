"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  ShoppingCart,
  IndianRupee,
  User,
  Hash,
} from "lucide-react";

export default function StorePage() {
  const { storeId } = useParams();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  const [name, setName] = useState("");
  const [table, setTable] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  // SESSION
  useEffect(() => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMyOrders();
  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await fetch(`${API}/product/${storeId}`);
    const data = await res.json();
    setProducts(data || []);
  };

  // FETCH ORDERS
  const fetchMyOrders = async () => {
    const sessionId = localStorage.getItem("session_id");
    const res = await fetch(`${API}/order/customer-orders/${sessionId}`);
    const data = await res.json();
    setMyOrders(data || []);
  };

  // ADD TO CART
  const addToCart = (product) => {
    const exist = cart.find((item) => item.name === product.name);

    if (exist) {
      setCart(
        cart.map((item) =>
          item.name === product.name
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // INCREASE
  const increaseQty = (product) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === product.name
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // DECREASE / REMOVE
  const decreaseQty = (product) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === product.name
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // PLACE ORDER
  const placeOrder = async () => {
    const sessionId = localStorage.getItem("session_id");

    if (!cart.length) return alert("Cart is empty");
    if (!name || !table) return alert("Enter details");

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const res = await fetch(`${API}/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        store_id: storeId,
        customer_name: name,
        table: Number(table),
        session_id: sessionId,
        items: cart.map((i) => ({
          product_id: i.id,
          qty: i.qty,
        })),
        total,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    if (data.success) {
      alert("Order placed ✅");
      setCart([]);
      setName("");
      setTable("");
      fetchMyOrders();
    }
  };

  // CANCEL ORDER
  const cancelOrder = async (id) => {
    if (!confirm("Cancel this order?")) return;

    const res = await fetch(`${API}/order/cancel/${id}`, {
      method: "PUT",
    });

    const data = await res.json();
    alert(data.message);
    fetchMyOrders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-6 pb-40">

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => {
          const itemInCart = cart.find((item) => item.name === p.name);

          return (
            <Card
              key={p.id}
              className="rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <CardContent className="p-4 flex flex-col gap-2">

                <h2 className="font-semibold text-sm">{p.name}</h2>

                <p className="font-bold flex items-center gap-1">
                  <IndianRupee size={14} /> {p.price}
                </p>

                {!itemInCart ? (
                  <Button size="sm" onClick={() => addToCart(p)}>
                    <PlusCircle size={14} /> Add
                  </Button>
                ) : (
                  <div className="flex items-center justify-between mt-2 bg-gray-100 rounded-lg px-2 py-1">

                    <button
                      className="text-lg font-bold px-2"
                      onClick={() => decreaseQty(p)}
                    >
                      −
                    </button>

                    <span className="text-sm font-semibold">
                      {itemInCart.qty}
                    </span>

                    <button
                      className="text-lg font-bold px-2"
                      onClick={() => increaseQty(p)}
                    >
                      +
                    </button>

                  </div>
                )}

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MY ORDERS */}
      {myOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">🧾 My Orders</h2>

          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md border p-4">

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Order #{order.id.slice(-4)}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-2 text-sm mb-2">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.name}</span>
                      <span>x{i.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold">₹ {order.total}</span>

                  {order.status !== "completed" &&
                    order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto">

          <h2 className="font-semibold flex items-center gap-2 mb-2">
            <ShoppingCart size={16} /> Cart
          </h2>

          {cart.length > 0 && (
            <div className="text-sm mb-2">
              {cart.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name}</span>
                  <span>x{i.qty}</span>
                </div>
              ))}
            </div>
          )}

          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
          />

          <Input
            placeholder="Table Number"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="mb-2"
          />

          <Button className="w-full" onClick={placeOrder}>
            Place Order
          </Button>

        </div>
      </div>
    </div>
  );
}