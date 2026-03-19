
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

  const [name, setName] = useState("");
  const [table, setTable] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `https://scan-menu-fastapi.onrender.com/product/${storeId}`
      );

      if (!res.ok) {
        setProducts([]);
        return;
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
    }
  };

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

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (!name.trim() || !table.trim()) {
      alert("Please enter name and table");
      return;
    }

    if (isNaN(table)) {
      alert("Table number must be numeric");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    try {
      const res = await fetch(
        "https://scan-menu-fastapi.onrender.com/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            store_id: storeId,
            customer_name: name,
            table: Number(table),
            items: cart.map((item) => ({
              product_id: String(item.id),
              qty: Number(item.qty),
            })),
            total: total,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      if (data.success) {
        alert("Order placed successfully ✅");
        setCart([]);
        setName("");
        setTable("");
      } else {
        alert("Order failed ❌");
      }
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-6 pb-32">

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p className="text-gray-500">No products available</p>
        ) : (
          products.map((p, i) => (
            <Card
              key={i}
              className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white"
            >
              <CardContent className="p-4 flex flex-col gap-2">

                <h2 className="font-semibold text-gray-800 text-sm">
                  {p.name}
                </h2>

                <p className="text-gray-900 font-bold flex items-center gap-1 text-sm">
                  <IndianRupee size={14} /> {p.price}
                </p>

                <Button
                  size="sm"
                  className="mt-2 flex items-center gap-1 hover:scale-[1.03] transition"
                  onClick={() => addToCart(p)}
                >
                  <PlusCircle size={14} /> Add
                </Button>

              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* CART (STICKY BOTTOM FOR PWA) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">

        <div className="max-w-md mx-auto">

          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <ShoppingCart size={16} /> Cart
          </h2>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 mb-3">Cart is empty</p>
          ) : (
            <div className="text-sm space-y-1 mb-3 max-h-24 overflow-y-auto">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-700"
                >
                  <span>{item.name}</span>
                  <span>x {item.qty}</span>
                </div>
              ))}
            </div>
          )}

          {/* INPUTS */}
          <div className="flex flex-col gap-2 mb-3">

            <div className="relative">
              <User
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="relative">
              <Hash
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />
              <Input
                placeholder="Table Number"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="pl-8"
              />
            </div>

          </div>

          {/* ORDER BUTTON */}
          <Button
            onClick={placeOrder}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium"
          >
            Place Order
          </Button>

        </div>
      </div>
    </div>
  );
}