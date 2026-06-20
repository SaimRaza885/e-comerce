import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Eye, RefreshCw, Edit3, Trash2, Package } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Button, Spinner } from "../../components/ui";

const statusBadge = (inStock) =>
  inStock
    ? "bg-green-50 text-green-700 border border-green-200"
    : "bg-red-50 text-red-700 border border-red-200";

const AdminDashboard = () => {
  const { user, accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) { navigate("/login"); return; }
    fetchProducts();
  }, [accessToken]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/product/all");
      const raw = res.data.data;
      setProducts(Array.isArray(raw) ? raw : raw?.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await api.delete(`/product/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const inStock = (p) => p.inStock ?? p.stock > 0;

  if (!user) return null;

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
        <Button variant="outline" onClick={fetchProducts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your products and orders</p>
          </div>
          <div className="flex gap-3">
            <Button variant="accent" onClick={() => navigate("/admin/dashboard/orders")} icon={<Eye className="w-4 h-4" />}>All Orders</Button>
            <Button variant="primary" onClick={() => navigate("/product/create")} icon={<PlusCircle className="w-4 h-4" />}>New Product</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length, color: "bg-primary/10", text: "text-primary" },
            { label: "In Stock", value: products.filter((p) => inStock(p)).length, color: "bg-green-50", text: "text-green-600" },
            { label: "Out of Stock", value: products.filter((p) => !inStock(p)).length, color: "bg-red-50", text: "text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Image", "Title", "Urdu Name", "Price", "Stock", "Status", "Actions", "Created"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    <img src={product.images?.[0]?.url || ""} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">{product.title}</td>
                  <td className="px-4 py-2 text-gray-500">{product.urdu_name || "—"}</td>
                  <td className="px-4 py-2 font-semibold">Rs. {product.price?.toLocaleString()}</td>
                  <td className="px-4 py-2">{product.stock ?? "—"}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(inStock(product))}`}>
                      {inStock(product) ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/product/update/${product._id}`)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deleting === product._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex gap-4 items-start mb-3">
                <img src={product.images?.[0]?.url || ""} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                  {product.urdu_name && <p className="text-xs text-gray-500">{product.urdu_name}</p>}
                  <p className="text-sm font-bold text-primary mt-1">Rs. {product.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium ${statusBadge(inStock(product))}`}>
                  {inStock(product) ? "In Stock" : "Out of Stock"} &middot; Stock: {product.stock ?? 0}
                </span>
                <span className="text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => navigate(`/product/update/${product._id}`)} className="flex-1 py-2 text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">Edit</button>
                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={deleting === product._id}
                  className="flex-1 py-2 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleting === product._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
