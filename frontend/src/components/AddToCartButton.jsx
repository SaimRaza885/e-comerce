import { useState, useEffect } from "react";
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/Cart";

const AddToCartButton = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Check if item already in cart
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
    const newQty = quantity + 1;
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

  return (
    <div className="flex items-center">
      {!inCart ? (
        <button
          onClick={handleAddToCart}
          className="btn-premium py-2 px-6 text-sm shadow-lg hover:shadow-primary/20"
        >
          <FiShoppingCart className="mr-2" /> Add
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-cream border border-primary/20 p-1 rounded-full shadow-inner">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-primary rounded-full hover:bg-gray-50 transition"
          >
            {quantity > 1 ? <FiMinus size={14} /> : <FiTrash2 size={14} className="text-red-500" />}
          </button>

          <span className="font-bold text-sm min-w-[24px] text-center text-primary">
            {quantity}
          </span>

          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:bg-opacity-90 transition"
          >
            <FiPlus size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
