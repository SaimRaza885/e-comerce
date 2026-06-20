import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, Phone, MapPin, ShoppingBag } from "lucide-react";
import api from "../../api/axios";
import { Badge, Spinner, Button } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import AccountSidebar from "../../components/AccountSidebar";

const statusVariant = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  canceled: "danger",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") { navigate("/admin/dashboard", { replace: true }); return; }
    if (!accessToken) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/order/me");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken, navigate, user]);

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
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">No Orders Yet</h2>
        <p className="text-sm text-gray-500 mb-6">Place your first order to see it here.</p>
        <Link to="/products/all">
          <Button variant="primary" icon={<ShoppingBag className="w-4 h-4" />}>
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={statusVariant[order.status] || "primary"}>
                  {order.status}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                    <img
                      src={item.product?.images?.[0]?.url || ""}
                      alt={item.product?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.product?.title || "Product"}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    Rs. {((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.city}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-gray-900">Rs. {order.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default MyOrders;
