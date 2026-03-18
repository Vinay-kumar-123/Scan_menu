// "use client";

// import { useEffect, useState } from "react";
// import UpgradeButton from "@/components/UpgradeButton";
// import SubscriptionBadge from "@/components/SubscriptionBadge";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [subInfo, setSubInfo] = useState(null);
//   // ✅ AUTO REFRESH
//   useEffect(() => {
//     fetchOrders();
//     fetchSubscription();
//     const interval = setInterval(() => {
//       fetchOrders();
//     }, 3000); // 3 sec

//     return () => clearInterval(interval);
//   }, []);

//   const fetchOrders = async () => {
//     if (subInfo?.plan === "NONE") {
//       return (
//         <div className="text-center mt-20">
//           <h2 className="text-xl font-bold mb-4">
//             Upgrade required to continue 🚀
//           </h2>

//           <UpgradeButton />
//         </div>
//       );
//     }
//     try {
//       const res = await fetch("http://127.0.0.1:8000/order/my-orders", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();
//       setOrders(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ✅ FIXED (status dynamic)
//   const updateStatus = async (id, status) => {
//     await fetch(`http://127.0.0.1:8000/order/update-status/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         status: status, // ✅ FIX
//       }),
//     });

//     fetchOrders(); // instant refresh
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
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Orders</h1>

//       {orders.length === 0 ? (
//         <p>No orders yet</p>
//       ) : (
//         orders.map((order) => (
//           <div key={order.id} className="border p-4 mb-4 rounded bg-white">
//             <h2 className="font-bold">
//               Table {order.table} - {order.customer_name}
//             </h2>

//             {/* ITEMS */}
//             {order.items.map((item, i) => (
//               <p key={i}>
//                 {item.name} x {item.qty}
//               </p>
//             ))}

//             <p className="mt-2 font-semibold">₹{order.total}</p>

//             <p className="mt-2">
//               Status: <b>{order.status}</b>
//             </p>

//             {/* BUTTONS */}
//             <div className="flex gap-2 mt-3">
//               <button
//                 onClick={() => updateStatus(order.id, "preparing")}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//               >
//                 Preparing
//               </button>

//               <button
//                 onClick={() => updateStatus(order.id, "completed")}
//                 className="bg-green-500 text-white px-3 py-1 rounded"
//               >
//                 Completed
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import UpgradeButton from "@/components/UpgradeButton";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [subInfo, setSubInfo] = useState(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  useEffect(() => {
    if (subInfo?.plan !== "NONE") {
      fetchOrders();
      const interval = setInterval(fetchOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [subInfo]);

  const fetchSubscription = async () => {
    const res = await fetch("http://127.0.0.1:8000/subscription/info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setSubInfo(data);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/order/my-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 403) return;

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://127.0.0.1:8000/order/update-status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  // 🔥 BLOCK UI
  if (subInfo?.plan === "NONE") {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold mb-4">
          Upgrade required to view orders 🚀
        </h2>
        <UpgradeButton />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4 rounded bg-white">
            <h2 className="font-bold">
              Table {order.table} - {order.customer_name}
            </h2>

            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} x {item.qty}
              </p>
            ))}

            <p className="mt-2 font-semibold">₹{order.total}</p>

            <p>Status: <b>{order.status}</b></p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(order.id, "preparing")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Preparing
              </button>

              <button
                onClick={() => updateStatus(order.id, "completed")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Completed
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}