import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import api from "../api/axios";
import ProductImages from "../components/ProductImages";
import { useCart } from "../context/Cart";
import Small_Banner from "../components/Small_Banner";
import PriceTag from "../components/PriceTag";
import Product_Details_SkeletonLoader from "../components/Product_Details_SkeletonLoader";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart(); // use cart context

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.data);
        console.log(res.data.message);
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
    addToCart(product, quantity);
    // alert(`${quantity} x ${product.title} added to cart!`);
  };

  if (loading) return <Product_Details_SkeletonLoader />

  if (error)
    return (
      <div className="text-center py-20 text-red-600">{error}</div>
    );

  if (!product) return null;

  return (
    <div className="pt-24 min-h-screen bg-cream/20">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Product Images */}
          <div className="lg:w-1/2 w-full animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl border border-gray-100 overflow-hidden">
              <ProductImages images={product.images || []} />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div>
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Premium Selection</span>
              <h1 className="text-4xl md:text-5xl font-black text-primary mb-2 leading-tight">
                {product.title}
              </h1>
              {product.urdu_name && (
                <p className="text-2xl text-secondary font-medium leading-relaxed italic">
                  {product.urdu_name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 py-6 border-y border-gray-100">
              <PriceTag price={product.price} size="xl" unit="kg" isBlack={false} />
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${product.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                {product.inStock ? "In Stock" : "Temporarily Unavailable"}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                {product.description || "Indulge in the finest organic dry fruits, handpicked from the pristine Gilgit valleys. Each piece is a burst of natural flavor and high-density nutrients, perfect for a refined healthy lifestyle."}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/50 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">Select Quantity (kg)</span>
                <div className="flex items-center gap-6 bg-white border border-gray-100 p-2 rounded-2xl shadow-inner">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="w-10 h-10 flex items-center justify-center bg-cream text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="text-xl font-black text-primary min-w-[20px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-secondary transition-all"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100/50">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                <div className="text-3xl font-black text-primary">
                  <PriceTag price={product.price * quantity} size="lg" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-premium py-5 text-lg group bg-primary"
                  disabled={!product.inStock}
                >
                  <FiShoppingCart className="mr-3 text-xl" />
                  Add To Cart
                </button>

                <a
                  href={`https://wa.me/923001234567?text=Hi! I want to order ${quantity} x ${product.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:px-8 py-5 rounded-full border-2 border-green-500 text-green-600 font-bold hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <FiShoppingCart className="text-xl" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
