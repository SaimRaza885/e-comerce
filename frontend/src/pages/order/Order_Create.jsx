import { useState } from "react";
import { useCart } from "../../context/Cart";
import { FiMapPin, FiPhone, FiCreditCard } from "react-icons/fi";
import { FaTruck } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Logo from "../../components/Logo";

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        phone: "",
        country: "",
        city: "",
        street: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const shippingFee = 200; // example fixed shipping fee

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            if (!form.phone || !form.country || !form.city || !form.street || cartItems.length === 0) {
                setError("All fields are required and cart must not be empty.");
                setLoading(false);
                return;
            }

            const res = await api.post("/order/create", {
                ...form,
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                })),
            });

            setSuccess("Order placed successfully!");
            clearCart();
            navigate("/"); // redirect to home or order confirmation page
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="flex items-center justify-center w-full mb-5 !text-7xl">

                <Logo size={30}/>
            </div>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
                {/* Shipping Form */}
                <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Details</h2>
                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border rounded px-3 py-2">
                            <FiPhone className="text-gray-400" />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 border rounded px-3 py-2">
                            <FiMapPin className="text-gray-400" />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 border rounded px-3 py-2">
                            <FiMapPin className="text-gray-400" />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 border rounded px-3 py-2">
                            <FiMapPin className="text-gray-400" />
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={form.street}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
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
                                    <p className="font-semibold text-gray-800">{item.quantity * item.price} PKR</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-between text-gray-700">
                            <div className="flex gap-1 items-center">

                                <FaTruck />  <span>Shipping Fee:</span>
                            </div>
                            <span>{shippingFee} PKR</span>
                        </div>
                    </div>

                    {/* Total Price Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-xl">
                        <span>Total:</span>
                        <span>{totalPrice + shippingFee} PKR</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Checkout;
