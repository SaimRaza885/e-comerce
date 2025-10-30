import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import OrderCard from "../../components/OrderStatusCard";
import BackArrow from "../../components/BackArrow";
import { saveAs } from "file-saver";
import { Calendar, Download, RefreshCw } from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    sort: "newest",
    startDate: "",
    endDate: "",
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("order/all");
        setOrders(res.data.data || []);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Optional: auto-refresh every 10 seconds
    // const interval = setInterval(fetchOrders, 1000);
    // return () => clearInterval(interval);
  }, []);

  // Delete order handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`order/delete/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  // Filter and sort logic
  const filteredOrders = orders
    .filter((order) => {
      const searchLower = filter.search.toLowerCase();
      const date = new Date(order.date);

      const matchSearch =
        order.phone?.includes(searchLower) ||
        order.city?.toLowerCase().includes(searchLower) ||
        order.country?.toLowerCase().includes(searchLower);

      const inDateRange =
        (!filter.startDate || date >= new Date(filter.startDate)) &&
        (!filter.endDate || date <= new Date(filter.endDate));

      return matchSearch && inDateRange;
    })
    .sort((a, b) => {
      if (filter.sort === "newest") return new Date(b.date) - new Date(a.date);
      if (filter.sort === "oldest") return new Date(a.date) - new Date(b.date);
      if (filter.sort === "price-high") return b.totalPrice - a.totalPrice;
      if (filter.sort === "price-low") return a.totalPrice - b.totalPrice;
      return 0;
    });

  // ✅ Download CSV (only filtered orders)
  const downloadCSV = () => {
    if (filteredOrders.length === 0)
      return alert("No filtered orders to download.");

    const csvRows = [
      ["ID", "Phone", "Country", "City", "Street", "Total Price", "Date"],
      ...filteredOrders.map((o) => [
        o._id,
        o.phone,
        o.country,
        o.city,
        o.street,
        o.totalPrice,
        new Date(o.date).toLocaleString(),
      ]),
    ];

    const csvString = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "filtered_orders.csv");
  };

  // Loader
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
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <BackArrow navigateto={-1} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Orders</h2>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Last Updated:{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString()
              : "Fetching..."}
          </span>
        </div>
      </div>

      {/* 🧭 Sticky Filter Bar */}
      <div className="sticky top-16 bg-white z-10 border-b border-gray-200 py-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by phone, city, or country..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full md:w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filter.sort}
            onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price High → Low</option>
            <option value="price-low">Price Low → High</option>
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="px-2 py-2 border rounded-md text-sm"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="px-2 py-2 border rounded-md text-sm"
          />

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
          >
            <Download size={16} /> Download CSV
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-all"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 text-sm mb-4">
        Showing <strong>{filteredOrders.length}</strong> of{" "}
        <strong>{orders.length}</strong> orders.
      </p>

      {/* Orders Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[70vh] pr-2">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <OrderCard order={order} onDelete={() => handleDelete(order._id)} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No orders match your filters.</p>
        )}
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default OrdersList;
