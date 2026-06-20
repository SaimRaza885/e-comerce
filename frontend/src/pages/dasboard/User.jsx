import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, User as UserIcon, Lock, LogOut, Package, Clock, RefreshCw } from "lucide-react";
import { Button, Spinner, Badge } from "../../components/ui";

const sidebarLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/my-orders", label: "My Orders", icon: ShoppingBag },
  { to: "/account/profile", label: "Profile", icon: UserIcon },
  { to: "/account/change-password", label: "Change Password", icon: Lock },
];

const statusVariant = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  canceled: "danger",
};

const User = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/order/me");
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 md:min-h-[calc(100vh-5rem)]">
          <h2 className="text-lg font-bold text-gray-900 mb-6">My Account</h2>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <Link
              to="/logout"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">Rs. {totalSpent.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "pending").length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link to="/my-orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-2">No orders yet</p>
                <p className="text-sm text-gray-400 mb-4">Start shopping to see your orders here.</p>
                <Link to="/products/all">
                  <Button variant="primary" size="sm">Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} item(s) &middot;{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant[order.status] || "primary"}>{order.status}</Badge>
                    <span className="text-sm font-bold text-gray-900">
                      Rs. {(order.totalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
