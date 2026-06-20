import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useCart } from "../../context/Cart";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Button, Input } from "../../components/ui";
import PriceTag from "../../components/PriceTag";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
  }, [user, navigate]);

  const [form, setForm] = useState({
    Name: "", phone: "", country: "", city: "", street: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const hasStockIssue = cartItems.some(
    (item) => item.stock != null && item.quantity > item.stock
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Name || !form.phone || !form.country || !form.city || !form.street) {
      setPopup({ visible: true, message: "Please fill all fields.", type: "error" });
      return;
    }
    const stockIssues = cartItems.filter(
      (item) => item.stock != null && item.quantity > item.stock
    );
    if (stockIssues.length > 0) {
      setPopup({
        visible: true,
        message: `Not enough stock for: ${stockIssues.map((i) => i.title).join(", ")}`,
        type: "error",
      });
      return;
    }
    setLoading(true);

    try {
      await api.post("/order/create", {
        ...form,
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setPopup({ visible: true, message: "Order placed successfully!", type: "success" });
      setTimeout(() => navigate("/my-orders"), 2000);
    } catch (err) {
      setPopup({
        visible: true,
        message: err.response?.data?.message || "Failed to place order",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-900">Processing your order...</p>
          </div>
        </div>
      )}

      {popup.visible && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg border font-medium text-sm transition-all ${
          popup.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {popup.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Shipping Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  icon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>
              <Input
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Pakistan"
                icon={<MapPin className="w-4 h-4" />}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Gilgit"
                  required
                />
                <Input
                  label="Street Address"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="House #, Street, Area"
                  required
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={hasStockIssue}
                icon={<CreditCard className="w-4 h-4" />}
                className="w-full mt-6"
                size="lg"
              >
                {loading
                  ? "Processing..."
                  : hasStockIssue
                    ? "Update Cart Quantities"
                    : "Place Order"}
              </Button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              Order Summary
            </h2>

            {hasStockIssue && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                Some items have insufficient stock. Please adjust quantities in your cart before placing the order.
              </div>
            )}

            <div className="space-y-3 mb-5">
              {cartItems.map((item) => {
                const insufficient = item.stock != null && item.quantity > item.stock;
                return (
                  <div key={item._id} className={`flex items-center gap-3 p-2.5 rounded-lg ${
                    insufficient ? "bg-red-50 border border-red-200" : "bg-gray-50"
                  }`}>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                      <img
                        src={item.images?.[0]?.url || ""}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {item.stock != null && (
                        <span className={`text-[10px] font-medium ${insufficient ? "text-red-500" : "text-green-600"}`}>
                          {insufficient ? `${item.stock} available` : `${item.stock} in stock`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-500"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-gray-900 text-sm">Total</span>
                <span className="text-lg font-bold text-gray-900">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
