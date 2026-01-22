import { useCart } from "../../context/Cart";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Small_Banner from "../../components/Small_Banner";
import { Images } from "../../assets/data";
import { useEffect } from "react";
import BackArrow from "../../components/BackArrow";
import PriceTag from "../../components/PriceTag";

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();



    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <BackArrow />
                <h2 className="text-4xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>


                <Link to="/products/all" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-md transition">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream/10 pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 w-full">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Your Selection</span>
                                <h1 className="text-4xl font-black text-primary">Shopping Cart</h1>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-sm font-bold text-secondary">{cartItems.length} Items</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="glass p-6 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border border-white/50 flex flex-col md:flex-row items-center gap-8 group"
                                >
                                    <div className="w-40 h-40 bg-white rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-gray-100">
                                        <img
                                            src={item.images?.[0]?.url || "/images/placeholder.png"}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="flex-grow flex flex-col md:flex-row md:justify-between w-full h-full py-2">
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-primary mb-1">{item.title}</h2>
                                                <p className="text-secondary text-sm font-medium italic mb-2">{item.urdu_name}</p>
                                                <PriceTag price={item.price} unit="kg" size="sm" />
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-widest"
                                            >
                                                <FiTrash2 /> Remove Item
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-end justify-between mt-6 md:mt-0">
                                            <div className="flex items-center gap-4 bg-white border border-gray-100 p-1.5 rounded-2xl shadow-inner">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center bg-cream text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all disabled:opacity-30"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="text-lg font-black text-primary min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-secondary transition-all"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>

                                            <div className="text-right mt-4">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Subtotal</p>
                                                <PriceTag price={item.price * item.quantity} size="md" isBlack={false} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Link to="/products/all" className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all group">
                                <FiArrowRight className="rotate-180" /> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary Summary Panel */}
                    <div className="lg:w-1/3 w-full sticky top-32">
                        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/50">
                            <h2 className="text-2xl font-black text-primary mb-8 underline decoration-accent decoration-4 underline-offset-8">Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="text-primary font-bold">Rs. {totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="h-px bg-gray-100 my-6"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-primary font-black uppercase tracking-widest text-xs">Grand Total</span>
                                    <div className="text-4xl font-black text-primary tracking-tighter">
                                        <PriceTag price={totalPrice} size="xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="btn-premium py-5 text-lg shadow-xl shadow-primary/20"
                                >
                                    Checkout Now
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiTrash2 /> Clear My Cart
                                </button>
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4 text-center">Secure Payments Guaranteed</p>
                                <div className="flex justify-center gap-4 opacity-30 grayscale">
                                    <div className="w-10 h-6 bg-gray-400 rounded-sm"></div>
                                    <div className="w-10 h-6 bg-gray-400 rounded-sm"></div>
                                    <div className="w-10 h-6 bg-gray-400 rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
