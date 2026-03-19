

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, MapPin } from "lucide-react";

export default function CreateStore() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
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
      const res = await fetch(
        `${API}/store/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      router.push("/admin");
    } catch (err) {
      alert("Error creating store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4 py-6">

      <Card className="w-full max-w-md rounded-2xl shadow-lg bg-white">
        
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Store size={20} /> Create Your Restaurant
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Set up your store to start receiving orders
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Restaurant Name
              </label>
              <Input
                name="name"
                placeholder="e.g. Vikash Restaurant"
                onChange={handleChange}
                required
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <Input
                  name="location"
                  placeholder="City / Area"
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] transition"
            >
              {loading ? "Creating..." : "Create Store"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}