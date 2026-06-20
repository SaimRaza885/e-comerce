import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ChevronRight, MessageCircle, RefreshCw, Edit3, Star } from "lucide-react";
import api from "../api/axios";
import ProductImages from "../components/ProductImages";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/AuthContext";
import { Button, Toast } from "../components/ui";
import ReviewSection from "../components/ReviewSection";
import Product_Details_SkeletonLoader from "../components/Product_Details_SkeletonLoader";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

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
    if (!product) return;
    if (type === "increment") setQuantity((q) => Math.min(q + 1, product.stock));
    else if (type === "decrement" && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToast({ message: `${quantity} × ${product.title} added to cart!`, type: "success" });
  };

  if (loading) return <Product_Details_SkeletonLoader />;

  if (error)
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-cream/20">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );

  if (!product) return null;

  const inStock = product.inStock ?? product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/products/all" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-2 lg:sticky lg:top-28">
              <ProductImages images={product.images || []} />
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
              {/* Stock Badge */}
              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  inStock
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
                {inStock && product.stock <= 10 && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">{product.averageRating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""})</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                {product.title}
              </h1>
              {product.urdu_name && (
                <p className="text-lg text-gray-500 mb-4 font-medium">{product.urdu_name}</p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-primary">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
                <span className="text-sm text-gray-400">/ kg</span>
              </div>

              {/* Short Description */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Quantity (kg)</span>
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-l-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-xl font-bold text-primary">Rs. {(product.price * quantity).toLocaleString()}</span>
                </div>
                {inStock && (
                  <p className="text-xs text-gray-400 mt-2">
                    {quantity >= product.stock
                      ? "Maximum available quantity reached"
                      : `${product.stock - quantity} kg remaining`}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isAdmin ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      disabled={!inStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <a
                      href={`https://wa.me/923001234567?text=Hi! I want to order ${quantity}kg of ${product.title} (Rs. ${(product.price * quantity).toLocaleString()})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-green-500 text-green-600 font-semibold hover:bg-green-500 hover:text-white transition-all text-sm"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Order via WhatsApp
                    </a>
                  </>
                ) : (
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    onClick={() => navigate(`/product/update/${product._id}`)}
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Product
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ReviewSection productId={id} />
      </div>
    </div>
  );
};

export default ProductDetail;
