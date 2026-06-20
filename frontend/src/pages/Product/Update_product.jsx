import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3, Package } from "lucide-react";
import api from "../../api/axios";
import { Button, Spinner } from "../../components/ui";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", urdu_name: "", description: "", price: "", inStock: true, stock: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/product/${id}`);
        const prod = res.data.data;
        setForm({
          title: prod.title || "",
          urdu_name: prod.urdu_name || "",
          description: prod.description || "",
          price: prod.price || "",
          inStock: prod.inStock,
          stock: prod.stock || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/product/update/${id}`, form);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Update Product</h1>
          <p className="text-sm text-gray-500 mt-1">Edit product details</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urdu Name *</label>
                <input name="urdu_name" value={form.urdu_name} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (per kg) *</label>
                <input type="number" name="price" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} placeholder="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>

            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <Button type="submit" loading={saving} className="w-full" size="lg" icon={<Edit3 className="w-4 h-4" />}>
              {saving ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
