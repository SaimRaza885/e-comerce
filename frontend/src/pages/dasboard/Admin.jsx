import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

// components
import DashboardHeader from "../../components/DashboardHeader";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import AdminProductCard from "../../components/ADminProductCard";
import AdminProductCardMobile from "../../components/AdminProductCardMobile";
import BackArrow from "../../components/BackArrow";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/product/all");
        setProducts(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => navigate(`/product/update/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/product/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-600 py-10 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <BackArrow />
      <DashboardHeader />

      <div className="flex  items-center justify-between p-2 border border-accent bg-accent/20 my-3 rounded-md">

        <p className="">{localStorage.getItem("date_login")}</p>

       <Link to={"/admin/login"} className="py-2 px-5 border-blue-400 bg-blue-500 text-white">Login Now</Link>
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Urdu Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Created On</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <AdminProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card view */}
      <div className="md:hidden grid gap-4">
        {products.map((product) => (
          <AdminProductCardMobile
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
