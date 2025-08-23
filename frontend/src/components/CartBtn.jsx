import { useCart } from "../context/CartContext";

// Example: Product page
const CartBTn = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product, 1)}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
};
