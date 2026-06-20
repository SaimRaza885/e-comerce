import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../context/Cart";

const ProductCard = ({ product, search = false }) => {
  const [imgError, setImgError] = useState(false);
  const { addToCart, cartItems } = useCart();
  const imageUrl = product.images?.[0]?.url;
  const inCart = cartItems.some((item) => item._id === product._id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-black text-gray-200">{product.title?.charAt(0)}</span>
            </div>
          )}

          {/* Quick add button (appears on hover) */}
          {!search && product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-2 right-2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-primary"
            >
              <ShoppingCart className={`w-4 h-4 ${inCart ? "text-accent" : "text-primary"}`} />
            </button>
          )}

          {/* Out of stock badge */}
          {!product.inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Out of Stock
            </div>
          )}

          {/* Low stock badge */}
          {product.inStock && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Only {product.stock}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-primary line-clamp-1 leading-snug">{product.title}</h3>
          {product.urdu_name && (
            <p className="text-[11px] text-gray-400 italic mt-0.5">{product.urdu_name}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-black text-primary">Rs. {product.price?.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 ml-1">/kg</span>
            </div>
            {!search && product.inStock && (
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent text-xs font-bold rounded-lg hover:bg-accent hover:text-primary transition-all"
              >
                <ShoppingCart className="w-3 h-3" /> Add
              </button>
            )}
            {!search && !product.inStock && (
              <span className="text-xs text-gray-300 font-medium">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
