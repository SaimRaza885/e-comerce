import { useState } from "react";
import { useCart } from "../../context/Cart";
import { FiMapPin, FiPhone, FiCreditCard, FiUser } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Logo from "../../components/Logo";
import PriceTag from "../../components/PriceTag";
import Small_Banner from "../../components/Small_Banner";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    country: "",
    city: "",
    street: "",
    Name: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const shippingFee = 200;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.phone || !form.Name || !form.country || !form.city || !form.street) {
        setPopup({ visible: true, message: "Please fill all fields.", type: "error" });
        setLoading(false);
        return;
      }

      await api.post("/order/create", {
        ...form,
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      });

      // Save locally too
      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...form,
        items: cartItems,
        totalPrice,
      };
      const existing = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([...existing, newOrder]));

      clearCart();
      setPopup({ visible: true, message: "✅ Order placed successfully!", type: "success" });

      // Wait 2 seconds, then navigate
      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    } catch (err) {
      console.error(err);
      setPopup({
        visible: true,
        message: err.response?.data?.message || "❌ Failed to place order.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-16 px-4">
               <Small_Banner title={"Ceckout"} bgImage={Images.shop_image}   subtitle={"Review the items in your cart before checking out."} />
   
      {/* ✅ Fullscreen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-700 font-semibold">Processing your order...</span>
          </div>
        </div>
      )}

      {/* ✅ Success/Error Popup */}
      {popup.visible && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
            popup.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup.message}
        </div>
      )}

      <div className="flex items-center justify-center w-full mb-5 text-7xl">
        <Logo size={20} />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Shipping Form */}
        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Details</h2>

          <div className="space-y-4">
            {[
              { icon: <FiPhone />, name: "phone", placeholder: "Phone Number" },
              { icon: <FiUser />, name: "Name", placeholder: "Customer Name" },
              { icon: <FiMapPin />, name: "country", placeholder: "Country" },
              { icon: <FiMapPin />, name: "city", placeholder: "City" },
              { icon: <FiMapPin />, name: "street", placeholder: "Street Address" },
            ].map((field) => (
              <div key={field.name} className="flex items-center gap-2 border rounded px-3 py-2">
                <span className="text-gray-400">{field.icon}</span>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-semibold shadow-md transition mt-6"
          >
            <FiCreditCard className="text-xl" />
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between py-4 items-center">
                  <div>
                    <p className="font-semibold text-gray-700">{item.title}</p>
                    <p className="text-gray-500 text-sm">
                      {item.quantity} x {item.price} PKR
                    </p>
                  </div>
                  <PriceTag price={item.price * item.quantity} size="md" isBlack />
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between text-gray-700">
              <div className="flex gap-1 items-center">
                <FaTruck /> <span>Shipping Fee:</span>
              </div>
              <span className="flex items-center space-x-2 text-sm">
                <del className="text-gray-400">{shippingFee} PKR</del>
                <span className="text-green-600 font-semibold">Free</span>
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-xl">
            <span>Total:</span>
            <PriceTag price={totalPrice} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
