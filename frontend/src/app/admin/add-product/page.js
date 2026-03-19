"use client";

import { useState } from "react";

export default function AddProduct() {
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("https://scan-menu-fastapi.onrender.com/product/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    alert("Product added");
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
    </div>
  );
}
