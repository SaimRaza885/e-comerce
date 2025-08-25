import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import OrderCard from "../../components/OrderStatusCard"
import BackArrow from "../../components/BackArrow";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("order/all");
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`order/delete/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <BackArrow navigateto={-1} />
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      {orders.length === 0 && <p>No orders found.</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onDelete={() => handleDelete(order._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
