

"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, IndianRupee, Boxes } from "lucide-react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const API = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    await fetch(`${API}/product/add`, {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4 py-6">

      <Card className="w-full max-w-md rounded-2xl shadow-lg bg-white">
        
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <PlusCircle size={20} /> Add Product
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Add new product to your store
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Product Name
              </label>
              <Input
                name="name"
                placeholder="e.g. Pizza"
                onChange={handleChange}
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Price
              </label>
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <Input
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* STOCK */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Stock
              </label>
              <div className="relative">
                <Boxes
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <Input
                  name="stock"
                  type="number"
                  placeholder="Available quantity"
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] transition"
            >
              <PlusCircle size={16} /> Add Product
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}