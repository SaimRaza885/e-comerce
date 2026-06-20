import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Download, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button, Spinner, Badge } from "../../components/ui";

const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  canceled: "danger",
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState({ search: "", sort: "newest", startDate: "", endDate: "" });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("order/all");
      setOrders(Array.isArray(res.data.data) ? res.data.data : []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`order/update/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`order/delete/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  const filteredOrders = orders
    .filter((o) => {
      const q = filter.search.toLowerCase();
      const match = o.phone?.toLowerCase().includes(q) || o.city?.toLowerCase().includes(q) || o.country?.toLowerCase().includes(q);
      const inRange = (!filter.startDate || new Date(o.createdAt) >= new Date(filter.startDate)) &&
        (!filter.endDate || new Date(o.createdAt) <= new Date(filter.endDate));
      return match && inRange;
    })
    .sort((a, b) => {
      const d = (k) => new Date(k.createdAt);
      switch (filter.sort) {
        case "newest": return d(b) - d(a);
        case "oldest": return d(a) - d(b);
        case "price-high": return (b.totalPrice || 0) - (a.totalPrice || 0);
        case "price-low": return (a.totalPrice || 0) - (b.totalPrice || 0);
        default: return 0;
      }
    });

  const downloadCSV = () => {
    if (!filteredOrders.length) return alert("No orders to download.");
    const rows = [["ID", "Name", "Phone", "Country", "City", "Street", "Total", "Date"],
      ...filteredOrders.map((o) => [o._id, o.Name, o.phone, o.country, o.city, o.street, o.totalPrice, new Date(o.createdAt).toLocaleString()])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "orders.csv");
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <RefreshCw className="w-12 h-12 text-red-300 mb-4" />
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Button variant="outline" onClick={fetchOrders}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredOrders.length} of {orders.length} orders
              {lastUpdated && <> &middot; Last updated {lastUpdated.toLocaleTimeString()}</>}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadCSV} icon={<Download className="w-4 h-4" />}>CSV</Button>
            <Button variant="primary" onClick={fetchOrders} icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by phone, city, or country..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={filter.sort}
              onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price High-Low</option>
              <option value="price-low">Price Low-High</option>
            </select>
            <input type="date" value={filter.startDate} onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <input type="date" value={filter.endDate} onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={statusColors[order.status] || "primary"}>{order.status}</Badge>
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1.5 mb-4 text-sm">
                  <p className="font-semibold text-gray-900">{order.Name || "N/A"}</p>
                  <p className="text-gray-500">{order.phone}</p>
                  <p className="text-gray-500">{order.city}, {order.country}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-primary">Rs. {(order.totalPrice || 0).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="px-2 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <button onClick={() => handleDelete(order._id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
