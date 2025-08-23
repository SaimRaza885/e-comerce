import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("order/my-orders", {
                withCredentials: true,
            });
            setOrders(data.data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };



    const statusClasses = {
        delivered: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        shipped: "bg-blue-100 text-blue-800",
        canceled: "bg-red-100 text-red-800",
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        setDeleting(id);
        try {
            await api.delete(`/order/delete/${id}`, { withCredentials: true });
            setOrders((prev) => prev.filter((order) => order._id !== id));
        } catch (err) {
            console.error("Error deleting order:", err);
            alert("Failed to delete order. Try again.");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading orders...</p>;

    if (orders.length === 0)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">Order Something Now</h2>
                <p className="text-gray-500 mb-6">Looks like you haven’t Order anything yet.</p>


                <Link to="/products/all" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-md transition">
                    Go to Shop
                </Link>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">
                My Orders
            </h1>

            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white shadow-lg rounded-2xl p-9 relative hover:shadow-xl transition duration-300"
                    >
                        {/* Delete Button */}
                        <button
                            onClick={() => handleDelete(order._id)}
                            disabled={deleting === order._id}
                            className={`absolute p-2 rounded-md top-3 right-3 font-medium text-sm transition ${deleting === order._id
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-200 text-red-500 hover:text-red-700 cursor-pointer"
                                }`}
                        >
                            {deleting === order._id ? "Deleting..." : "Delete"}
                        </button>


                        {/* Order Header */}
                        <div className="flex justify-between items-center my-5">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Order #{order._id.slice(-6)}
                            </h2>
                            <span
                                className={`px-4 py-1 rounded-full text-xs font-medium ${statusClasses[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
                            >
                                {order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 py-4"
                                >
                                    <img
                                        src={item.product.images[0].url}
                                        alt={item.product.title}
                                        className="w-20 h-20 object-cover rounded-xl border"
                                        loading="lazy"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            {item.product.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} × {item.product.price} PKR
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                        {item.quantity * item.product.price} PKR
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer */}
                        <div className="mt-5 flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                            <span>
                                Placed on:{" "}
                                <span className="font-medium text-gray-800">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </span>
                            <span className="font-bold text-gray-900 text-lg">
                                Total: {order.totalAmount} PKR
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
