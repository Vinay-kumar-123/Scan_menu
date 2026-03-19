
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trash2,
  Package,
  IndianRupee,
  Boxes,
  Check,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const API = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(
      `${API}/product/my-products`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    await fetch(
      `${API}/product/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchProducts();
  };

  const updateProduct = async () => {
    await fetch(
      `${API}/product/update/${editing.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editing),
      }
    );

    setEditing(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-6 md:px-8">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package size={22} /> My Products
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your products easily
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <Card
            key={p.id}
            className="rounded-2xl shadow-sm hover:shadow-lg transition bg-white"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {editing?.id === p.id ? "Edit Product" : p.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">

              {editing?.id === p.id ? (
                <>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="Product Name"
                  />

                  <Input
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                    placeholder="Price"
                    type="number"
                  />

                  <Input
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({ ...editing, stock: e.target.value })
                    }
                    placeholder="Stock"
                    type="number"
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={updateProduct}
                      className="flex-1 gap-1"
                    >
                      <Check size={16} /> Save
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setEditing(null)}
                      className="flex-1 gap-1"
                    >
                      <X size={16} /> Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* INFO */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <IndianRupee size={14} /> {p.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Boxes size={14} /> {p.stock}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      className="flex-1 gap-1 hover:scale-[1.02] transition"
                      onClick={() => setEditing(p)}
                    >
                      <Pencil size={14} /> Edit
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1 gap-1 hover:scale-[1.02] transition"
                      onClick={() => deleteProduct(p.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}