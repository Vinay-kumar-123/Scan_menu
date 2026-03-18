"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function CreateStore() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/store/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      // success
      router.push("/admin");

    } catch (err) {
      alert("Error creating store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4">
          Create Your Restaurant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Restaurant Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="location"
            placeholder="City / Location"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button
            className="w-full bg-orange-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Store"}
          </button>

        </form>
      </div>
    </div>
  );
}