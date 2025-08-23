import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Small_Banner from "../../components/Small_Banner";
import { Images } from "../../assets/data";

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

    return (
        <>
            <Navbar />
            <Small_Banner
                title={"My Orders"}
                subtitle={"All your past and current orders in one place."}
                bgImage={Images.order_Image}
            />

            <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">My Account</h2>
                    <nav className="flex flex-col space-y-2">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""
                                }`
                            }
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to="/dashboard/orders"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""
                                }`
                            }
                        >
                            Orders
                        </NavLink>
                        <NavLink
                            to="/account/profile"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""
                                }`
                            }
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/account/change-password"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-200 font-semibold" : ""
                                }`
                            }
                        >
                            Change Password
                        </NavLink>
                        <Link
                            to="/logout"
                            className="px-4 py-2 rounded hover:bg-gray-200 text-red-500"
                        >
                            Logout
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {orders.length === 0 ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6 rounded-xl shadow-md">
                            <h2 className="text-4xl font-bold mb-4 text-gray-800">
                                No Orders Yet
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Looks like you haven’t ordered anything yet.
                            </p>
                            <Link
                                to="/products/all"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-md transition"
                            >
                                Go to Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                            {orders.map((order) => {
                                const orderTotal = order.items.reduce(
                                    (acc, item) => acc + item.quantity * item.product.price,
                                    0
                                );

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white shadow-lg rounded-2xl p-6  hover:shadow-2xl transition duration-300 flex flex-col sm:flex-col md:flex-col lg:flex-col"
                                    >

                                        {/* Order Header */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                Order #{order._id.slice(-6)}
                                            </h2>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                disabled={deleting === order._id}
                                                className={`  p-2 rounded-md font-medium text-sm transition ${deleting === order._id
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-red-200 text-red-500 hover:text-red-700 cursor-pointer"
                                                    }`}
                                            >
                                                {deleting === order._id ? "Deleting..." : "Delete"}
                                            </button>

                                            <span
                                                className={`px-4 py-1 rounded-full text-xs font-medium ${statusClasses[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Items */}
                                        <div className="divide-y divide-gray-200">
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 py-3"
                                                >
                                                    <img
                                                        src={item.product.images[0].url}
                                                        alt={item.product.title}
                                                        className="w-20 h-20 object-cover rounded-lg border flex-shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{item.product.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.quantity} × {item.product.price} PKR
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-gray-800 mt-2 sm:mt-0">
                                                        {item.quantity * item.product.price} PKR
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 border-t pt-4 gap-2">
                                            <span>
                                                Placed on:{" "}
                                                <span className="font-medium text-gray-800">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </span>
                                            <span className="font-bold text-gray-900 text-lg">
                                                Total: {orderTotal} PKR
                                            </span>
                                        </div>
                                    </div>

                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default OrdersPage;
