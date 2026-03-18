// "use client";

// import { useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import { useRouter } from "next/navigation";
// import UpgradeButton from "@/components/UpgradeButton";
// import SubscriptionBadge from "@/components/SubscriptionBadge";

// export default function Dashboard() {
//   const router = useRouter();
//   const [subInfo, setSubInfo] = useState(null);
//   const [store, setStore] = useState(null);
//   const [stats, setStats] = useState({
//     total_orders: 0,
//     total_revenue: 0,
//   });

//   useEffect(() => {
//     fetchStore();
//     fetchStats();
//     fetchSubscription();
//   }, []);

//   const fetchStore = async () => {
//     const res = await fetch("http://127.0.0.1:8000/store/my-store", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     if (!res.ok) {
//       router.push("/create-store"); // 🔥 BLOCK ACCESS
//     }
//     const data = await res.json();
//     setStore(data);
//   };

//   const fetchStats = async () => {
//     const res = await fetch("http://127.0.0.1:8000/order/stats", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();
//     setStats(data);
//   };

//   const fetchSubscription = async () => {
//     const res = await fetch("http://127.0.0.1:8000/subscription/info", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();
//     setSubInfo(data);
//   };

//   return (
//     <div className="min-h-screen bg-orange-50 p-6">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//       <div className="flex justify-between items-center mb-4">
//         <SubscriptionBadge info={subInfo} />

//         {subInfo?.plan === "NONE" && (
//           <UpgradeButton /> // 🔥 SHOW BUTTON
//         )}
//       </div>
//       {/* GRID */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {/* STORE CARD */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="text-xl font-bold">{store?.name}</h2>
//           <p className="text-gray-500 mb-4">{store?.location}</p>

//           <div className="flex justify-center mb-4">
//             <QRCodeCanvas value={store?.store_url || ""} size={150} />
//           </div>

//           <p className="text-xs break-all text-center">{store?.store_url}</p>
//         </div>

//         {/* ACTIONS */}
//         <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
//           <h2 className="font-bold">Quick Actions</h2>

//           <button
//             onClick={() => router.push("/admin/add-product")}
//             className="bg-orange-500 text-white py-2 rounded"
//           >
//             ➕ Add Product
//           </button>

//           <button
//             onClick={() => router.push("/admin/products")}
//             className="bg-blue-500 text-white py-2 rounded"
//           >
//             📦 View Products
//           </button>

//           <button
//             onClick={() => router.push("/admin/orders")}
//             className="bg-green-500 text-white py-2 rounded"
//           >
//             🧾 View Orders
//           </button>
//         </div>

//         {/* STATS (future ready) */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="font-bold mb-2">Stats</h2>
//           <p>Orders: {stats.total_orders}</p>
//           <p>Revenue: ₹{stats.total_revenue}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";
import UpgradeButton from "@/components/UpgradeButton";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default function Dashboard() {
  const router = useRouter();

  const [subInfo, setSubInfo] = useState(null);
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");

    try {
      const [storeRes, statsRes, subRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/store/my-store", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://127.0.0.1:8000/order/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://127.0.0.1:8000/subscription/info", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!storeRes.ok) {
        router.push("/create-store");
        return;
      }

      const storeData = await storeRes.json();
      const statsData = await statsRes.json();
      const subData = await subRes.json();

      setStore(storeData);
      setStats(statsData);
      setSubInfo(subData);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* 🔥 SUBSCRIPTION */}
      <div className="flex justify-between items-center mb-4">
        <SubscriptionBadge info={subInfo} />
        {subInfo?.plan === "NONE" && <UpgradeButton />}
      </div>

      {/* 🔥 BLOCK UI */}
      {subInfo?.plan === "NONE" && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center">
          Your subscription expired 🚀 Upgrade to continue
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {/* STORE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">{store?.name}</h2>
          <p className="text-gray-500 mb-4">{store?.location}</p>

          <div className="flex justify-center mb-4">
            <QRCodeCanvas value={store?.store_url || ""} size={150} />
          </div>

          <p className="text-xs break-all text-center">{store?.store_url}</p>
        </div>

        {/* ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
          <h2 className="font-bold">Quick Actions</h2>

          <button
            onClick={() =>
              subInfo?.plan === "NONE"
                ? alert("Upgrade required")
                : router.push("/admin/add-product")
            }
            className="bg-orange-500 text-white py-2 rounded"
          >
            ➕ Add Product
          </button>

          <button
            onClick={() =>
              subInfo?.plan === "NONE"
                ? alert("Upgrade required")
                : router.push("/admin/products")
            }
            className="bg-blue-500 text-white py-2 rounded"
          >
            📦 View Products
          </button>

          <button
            onClick={() =>
              subInfo?.plan === "NONE"
                ? alert("Upgrade required")
                : router.push("/admin/orders")
            }
            className="bg-green-500 text-white py-2 rounded"
          >
            🧾 View Orders
          </button>
        </div>

        {/* STATS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-2">Stats</h2>
          <p>Orders: {stats.total_orders}</p>
          <p>Revenue: ₹{stats.total_revenue}</p>
        </div>
      </div>
    </div>
  );
}