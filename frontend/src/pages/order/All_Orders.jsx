import { useEffect, useState } from "react";
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
  }, []);

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

  const filteredOrders = orders
    .filter((order) => {
      const searchLower = filter.search.toLowerCase();
      const date = new Date(order.createdAt);

      const matchSearch =
        order.phone?.toString().toLowerCase().includes(searchLower) ||
        order.city?.toLowerCase().includes(searchLower) ||
        order.country?.toLowerCase().includes(searchLower);

      const inDateRange =
        (!filter.startDate || date >= new Date(filter.startDate)) &&
        (!filter.endDate || date <= new Date(filter.endDate));

      return matchSearch && inDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (filter.sort) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "price-high":
          return b.totalPrice - a.totalPrice;
        case "price-low":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

  const downloadCSV = () => {
    if (filteredOrders.length === 0)
      return alert("No filtered orders to download.");

    const csvRows = [
      ["ID", "Name", "Phone", "Country", "City", "Street", "Total Price", "Date"],
      ...filteredOrders.map((o) => [
        o._id,
        o.Name,
        o.phone,
        o.country,
        o.city,
        o.street,
        o.totalPrice,
        new Date(o.createdAt).toLocaleString(),
      ]),
    ];

    const csvString = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "filtered_orders.csv");
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Orders</h2>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar size={16} />
          <span>Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Fetching..."}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className=" bg-white z-10 border-b border-gray-200 py-4 mb-6 flex flex-wrap items-center justify-between gap-4">
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
        Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders.
      </p>

      {/* Orders Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[100vh] pr-2">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={order._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
              <OrderCard order={order} onDelete={() => handleDelete(order._id)} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No orders match your filters.</p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
      `}</style>
    </div>
  );
};

export default OrdersList;
