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
          className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-full shadow-md transition font-medium
          bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <FiShoppingCart className="text-lg" /> Add to Cart
        </button>
      ) : (
        <div className="flex items-center gap-3  text-white px-4 py-2 rounded-full shadow-md">
          <button
            onClick={handleDecrease}
            className="p-1 bg-red-600 hover:bg-red-700 rounded-full "
          >
            {quantity > 1 ? <FiMinus /> : <FiTrash2 />}
          </button>

          <span className="font-semibold text-lg min-w-[20px] text-center  text-black">
            {quantity}
          </span>

          <button
            onClick={handleIncrease}
            className="p-1 bg-green-600 hover:bg-green-700 rounded-full"
          >
            <FiPlus />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
