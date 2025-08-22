// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/Product_Card";
import Small_Banner from "../components/Small_Banner";
import api from "../api/axios";
import { Images } from "../assets/data";


const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // for skeleton loading
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/product/all"); // adjust endpoint
        setProducts(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Skeleton Loader
  const renderSkeletons = () => (
    <div className="grid gap-8 px-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg shadow p-4 animate-pulse"
        >
          <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>

      {/* Banner Section */}
      <Small_Banner
        title="SHOP"
        subtitle="Here you will find all the items available in our store."
        bgImage={Images.shop_image1} // Replace with actual image path or import
      />

      {/* Products Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          All Products
        </h2>

        {error && <div className="text-center text-red-600">{error}</div>}

        {loading ? (
          renderSkeletons()
        ) : (
          <div className="grid gap-8 px-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
