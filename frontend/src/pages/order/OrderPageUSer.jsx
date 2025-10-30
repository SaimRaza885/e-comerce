import React, { useState, useEffect } from "react";
import { MapPin, Phone, Calendar, Trash2, Clock } from "lucide-react";
import BackArrow from "../../components/BackArrow";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    // Load orders from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("orders") || "[]");
        if (Array.isArray(saved)) {
            const sorted = [...saved].sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(sorted);
        }
    }, []);

    // Remove an order by ID
    const handleRemove = (id) => {
        const updated = orders.filter((order) => order.id !== id);
        setOrders(updated);
        localStorage.setItem("orders", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
            <BackArrow/>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    My Orders
                </h1>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        You haven’t placed any orders yet.
                    </p>
                ) : (
                    <div className="space-y-6 grid  3 gap-5  md:grid-cols-2">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-200"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center border-b pb-3 mb-3">

                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Clock size={16} className="text-yellow-600" />
                                        <span>
                                            {order.date
                                                ? new Date(order.date).toLocaleString()
                                                : "No Date Available"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(order.id)}
                                        className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                </div>

                                {/* Items */}
                                <div className="space-y-2 mb-3">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between text-sm text-gray-700 border-b pb-2"
                                        >
                                            <span className="font-medium">{item.title}</span>
                                            <div className="text-right">
                                                <span className="block">Quantity: {item.quantity}</span>
                                                <span className="text-gray-500 text-xs">
                                                    Rs {item.price?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Info */}
                                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        <span>{order.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        <span>
                                            {order.street}, {order.city}, {order.country}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-4 text-right">
                                    <span className="font-semibold text-gray-800">
                                        Total:{" "}
                                        <span className="text-yellow-600">
                                            Rs {order.totalPrice?.toLocaleString()}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
