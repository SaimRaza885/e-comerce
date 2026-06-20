import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/Cart";

const AddToCartButton = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const existing = cartItems.find((item) => item._id === product._id);
    if (existing) {
      setInCart(true);
      setQuantity(existing.quantity);
    } else {
      setInCart(false);
      setQuantity(1);
    }
  }, [cartItems, product._id]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setInCart(true);
  };

  const handleIncrease = () => {
    const maxStock = product.stock ?? Infinity;
    const newQty = Math.min(quantity + 1, maxStock);
    setQuantity(newQty);
    updateQuantity(product._id, newQty);
  };

  const handleDecrease = () => {
    const newQty = quantity - 1;
    if (newQty <= 0) {
      removeFromCart(product._id);
      setInCart(false);
      setQuantity(1);
    } else {
      setQuantity(newQty);
      updateQuantity(product._id, newQty);
    }
  };

  if (!product.inStock && product.stock === 0) {
    return (
      <span className="text-xs font-medium text-red-500">Unavailable</span>
    );
  }

  return (
    <div className="flex items-center">
      {!inCart ? (
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-6 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Add
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-primary rounded-lg hover:bg-gray-100 transition"
          >
            {quantity > 1 ? <Minus className="w-3 h-3" /> : <Trash2 className="w-3 h-3 text-red-500" />}
          </button>
          <span className="font-bold text-sm min-w-[20px] text-center text-primary">{quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= (product.stock ?? Infinity)}
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
