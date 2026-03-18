"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
      const res = await fetch(`http://127.0.0.1:8000/product/${storeId}`);

      if (!res.ok) {
        console.log("API error");
        setProducts([]);
        return;
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  };

  const addToCart = (product) => {
    const exist = cart.find((item) => item.name === product.name);

    if (exist) {
      setCart(
        cart.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const placeOrder = async () => {
    // ✅ validation
    if (!name.trim() || !table.trim()) {
      alert("Please enter name and table");
      return;
    }

    if (isNaN(table)) {
      alert("Table number must be numeric");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    try {
      const res = await fetch("http://127.0.0.1:8000/order/create", {
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
      });

      const data = await res.json(); // ✅ now correct

      if (!res.ok) {
        alert(JSON.stringify(data));

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
    <div className="p-6">
      {/* 🟢 NAME + TABLE INPUT */}

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 gap-4">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((p, i) => (
            <div key={i} className="border p-4 rounded">
              <h2>{p.name}</h2>
              <p>₹{p.price}</p>

              <button
                onClick={() => addToCart(p)}
                className="bg-orange-500 text-white px-3 py-1 rounded mt-2"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>

      {/* CART */}
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="font-bold">Cart</h2>

        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item, i) => (
            <div key={i}>
              {item.name} x {item.qty}
            </div>
          ))
        )}
      </div>
      <div className="mt-6">
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <input
            placeholder="Enter Table Number (e.g. 5)"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={placeOrder}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
