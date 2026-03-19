"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("https://scan-menu-fastapi.onrender.com/product/my-products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  // 🗑️ DELETE
  const deleteProduct = async (id) => {
    await fetch(`https://scan-menu-fastapi.onrender.com/product/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchProducts();
  };

  // ✏️ UPDATE
  const updateProduct = async () => {
    await fetch(`https://scan-menu-fastapi.onrender.com/product/update/${editing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">My Products</h1>

      {products.map((p) => (
        <div key={p.id} className="border p-4 mb-3 rounded bg-white">
          {editing?.id === p.id ? (
            <>
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="border p-1 mb-2 w-full"
              />

              <input
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
                className="border p-1 mb-2 w-full"
              />

              <input
                value={editing.stock}
                onChange={(e) =>
                  setEditing({ ...editing, stock: e.target.value })
                }
                className="border p-1 mb-2 w-full"
              />

              <button
                onClick={updateProduct}
                className="bg-green-500 text-white px-3 py-1 mr-2"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-3 py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2 className="text-green-500">{p.name}</h2>
              <p>₹{p.price}</p>
              <p>Stock: {p.stock}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditing(p)}
                  className="bg-blue-500 text-white px-3 py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
