// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import api from "../api/axios";
import ProductImages from "../components/ProductImages";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((q) => q + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    // Replace with cart context or localStorage logic
    alert(`Added ${quantity} x ${product.title} to cart!`);
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Images */}
        <ProductImages images={product.images || []} />

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{product.title}</h1>
          {product.urdu_name && (
            <p className="text-gray-500 mb-4 text-lg">{product.urdu_name}</p>
          )}
          <p className="text-2xl font-bold  mb-4">{product.price} PKR / kg</p>
          <p
            className={`text-sm font-medium mb-4 ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
          {product.description && (
            <p className="text-gray-700 mb-6">{product.description}</p>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="p-2 border rounded hover:bg-gray-100 transition"
            >
              <FiMinus />
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="p-2 border rounded hover:bg-gray-100 transition"
            >
              <FiPlus />
            </button>
          </div>

          {/* Total Price */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-center justify-between shadow-sm">
            <span className="text-gray-700 font-medium text-lg">Total Price:</span>
            <span className="text-yellow-600 font-bold text-xl">
              {quantity * product.price} PKR
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap mt-6">
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-6 py-3 rounded-full shadow-md transition"
            >
              <FiShoppingCart /> Add to Cart
            </button>

            <a
              href={`https://wa.me/923001234567?text=Hi! I want to order ${quantity} x ${product.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-3 rounded-full shadow-md transition"
            >
              <FiShoppingCart /> Buy on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
