import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/Cart";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";
import PriceTag from "../../components/PriceTag";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => setRemovingId(null);
  }, []);

  const handleRemove = (id) => {
    setRemovingId(id);
    const timer = setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 200);
    return () => clearTimeout(timer);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-secondary" />
        </div>
        <h2 className="text-3xl font-black text-primary mb-2">Your Cart is Empty</h2>
        <p className="text-secondary mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products/all">
          <Button variant="primary" size="lg" icon={<ShoppingBag className="w-4 h-4" />}>
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/10 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:w-2/3 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                {cartItems.length} Item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group ${
                    removingId === item._id ? "opacity-0 scale-95" : "opacity-100"
                  }`}
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={item.images?.[0]?.url || ""}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>

                  <div className="flex-grow flex flex-col md:flex-row md:justify-between w-full gap-4">
                    <div className="flex flex-col justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-0.5">{item.title}</h2>
                        {item.urdu_name && <p className="text-xs text-gray-500 mb-1">{item.urdu_name}</p>}
                        <p className="text-sm font-semibold text-gray-700">Rs. {item.price.toLocaleString()} / kg</p>
                        <span className={`inline-block mt-1 text-[11px] font-medium ${
                          item.stock > 5 ? "text-green-600" : item.stock > 0 ? "text-amber-600" : "text-red-500"
                        }`}>
                          {item.stock > 5 ? "In Stock" : item.stock > 0 ? `Only ${item.stock} left` : "Out of Stock"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                        <p className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        {item.stock > 0 && item.quantity >= item.stock && (
                          <p className="text-[10px] text-amber-600 font-medium mt-0.5">Max</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/products/all" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3 w-full sticky top-32">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-gray-900 text-sm">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full"
                  size="lg"
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  Checkout
                </Button>
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-500 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
