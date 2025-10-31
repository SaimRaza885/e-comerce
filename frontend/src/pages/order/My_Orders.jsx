import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");
      return Array.isArray(saved) ? saved : [saved];
    } catch (err) {
      console.error("Error parsing localStorage orders:", err);
      return [];
    }
  });

  // Helper function to reload orders from localStorage
  const loadOrders = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(Array.isArray(saved) ? saved : [saved]);
    } catch (err) {
      console.error("Error reloading orders from localStorage:", err);
    }
  };

  // 🪄 Reload if localStorage changes (even across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "orders") loadOrders();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        🛒 No orders yet — place your first order!
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-800">
                Order #{order.id}
              </h3>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.status || "Pending"}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              📅{" "}
              {order.date
                ? new Date(order.date).toLocaleString()
                : "Date not available"}
            </p>

            <div className="divide-y divide-gray-200 mt-4">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{item.title}</p>
                    <p className="text-gray-500 text-sm">
                      {item.quantity} × Rs.{item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    Rs.{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-gray-700 font-semibold">
              <span>Total:</span>
              <span>Rs.{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
