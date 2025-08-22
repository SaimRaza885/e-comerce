// src/components/ProductSection.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/Product_Card";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Skeleton card (dummy card while loading)
  const SkeletonCard = () => (
    <div className="border border-gray-200 rounded-lg shadow p-4 animate-pulse h-96 flex flex-col items-center">
      <div className="w-40 h-40 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
      <div className="h-5 w-16 bg-gray-200 rounded mt-auto"></div>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-white to-mint-50" id="product">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our Premium Dry Fruits
        </h2>
        <p className="mt-2 text-gray-600">
          Straight from Gilgit’s mountains — pure, organic, and healthy.
        </p>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : error
          ? <div className="col-span-full text-center text-red-600">{error}</div>
          : products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
        }
      </div>

      {/* Show All Button */}
      {!loading && !error && products.length > 4 && (
        <div className="text-center mt-10">
          <Link
            to="products/all"
            className="inline-block bg-accent text-black font-medium px-6 py-3 rounded-full shadow hover:bg-mint-600 transition"
          >
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
