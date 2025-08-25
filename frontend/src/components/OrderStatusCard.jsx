import React, { useState } from "react";
import api from "../api/axios";

const OrderCard = ({ order, onDelete }) => {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const allowedStatus = ["pending", "shipped", "delivered", "canceled"];
  const statusClasses = {
    delivered: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    canceled: "bg-red-100 text-red-800",
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);

    try {
      await api.put(`/order/status/${order._id}`, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(order.status); // revert on error
    } finally {
      setUpdating(false);
    }
  };

 return (
  <div className="bg-white relative shadow-lg rounded-xl p-6 py-12 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
    {/* Delete button in top-right corner */}
    <button
      onClick={onDelete}
      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
    >
      Delete
    </button>

    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <h3 className="text-lg font-semibold text-gray-800">
        Order ID: <span className="text-gray-500">{order._id.slice(-6)}</span>
      </h3>

      <select
        value={status}
        onChange={handleStatusChange}
        disabled={updating}
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}
      >
        {allowedStatus.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>

    {/* Customer Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
      <p><span className="font-medium">Total:</span> {order.totalPrice} PKR</p>
      <p><span className="font-medium">Customer:</span> {order.user?.fullName || "N/A"} ({order.user?.email || "N/A"})</p>
      <p><span className="font-medium">Address:</span> {order.street}, {order.city}, {order.country}</p>
      <p><span className="font-medium">Phone:</span> {order.phone}</p>
    </div>

    {/* Items */}
    <h4 className="font-medium text-gray-700 mb-2">Items</h4>
    <div className="space-y-2">
      {order.items?.map((item) => (
        <div key={item._id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-gray-700">{item.product?.title || "N/A"}</span>
          <span className="text-gray-500 text-sm">{item.quantity} × {item.product?.price || 0} PKR</span>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
      <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
      <span className="font-semibold">Total: {order.totalPrice} PKR</span>
    </div>
  </div>
);

};

export default OrderCard;
