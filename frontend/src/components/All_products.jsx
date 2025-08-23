import { useEffect, useState } from "react";
import OrderStatusCard from "../../components/OrderStatusCard";
import api from "../api/axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]); // always an array
  const [loading, setLoading] = useState(true);

  // fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await api.get("/order/all");

        // 🔎 Log response once to see shape
        console.log("All orders API response:", res.data);

        // ✅ Handle flexible API shapes safely
        const data = res.data?.data || res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error.response?.data?.message || "Error fetching orders");
        setOrders([]); // fallback if request fails
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No orders found.
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 All Orders</h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <OrderStatusCard
            key={order._id}
            order={order}
            onStatusChange={(id, newStatus) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o._id === id ? { ...o, status: newStatus } : o
                )
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
