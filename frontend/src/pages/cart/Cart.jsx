import { useCart } from "../../context/Cart";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Small_Banner from "../../components/Small_Banner";
import { Images } from "../../assets/data";

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>


                <Link to="/products/all" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-md transition">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Small_Banner title={"Shopping Cart"}  bgImage={Images.shop_image} subtitle={"Review the items in your cart before checking out."}/>
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Cart Itemst</h1>
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={item.images?.[0]?.url || "/images/placeholder.png"}
                                    alt={item.title}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div className="flex-1 flex flex-col md:flex-row md:justify-between w-full">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                                        <p className="text-gray-500">{item.urdu_name}</p>
                                        <p className="text-yellow-600 font-bold mt-1">{item.price} PKR / kg</p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="p-2 border rounded hover:bg-gray-100 transition"
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="text-lg font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-2 border rounded hover:bg-gray-100 transition"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-end mt-4 md:mt-0 gap-2">
                                        <span className="font-bold text-lg">{item.price * item.quantity} PKR</span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                                        >
                                            <FiTrash2 /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Panel */}
                    <div className="lg:w-96 bg-white p-6 rounded-xl shadow-md sticky top-16">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
                        <div className="flex justify-between text-gray-700 mb-2">
                            <span>Items ({cartItems.length})</span>
                            <span>{totalPrice} PKR</span>
                        </div>
                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                            <span>Total</span>
                            <span>{totalPrice} PKR</span>
                        </div>






                        <div className="space-y-4">
                            {/* Checkout Button */}
                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-semibold shadow-md transition"
                            >
                                <FiShoppingCart className="text-2xl" />
                                Proceed to Checkout
                            </button>

                            {/* Clear Cart Button */}
                            <button
                                onClick={clearCart}
                                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold shadow-md transition"
                            >
                                <FiTrash2 className="text-xl" />
                                Clear Cart
                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
