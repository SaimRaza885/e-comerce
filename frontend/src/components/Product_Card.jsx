import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import PriceTag from "./PriceTag";
import Animated_Borders from "./Animated_Borders";

const ProductCard = ({ product, search = false }) => {
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

  return (
    <div className="card-premium hover-glow group cursor-pointer flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-cream/30">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {product.inStock === false && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary mb-1 line-clamp-1">{product.title}</h3>
        {product.urdu_name && (
          <p className="text-secondary text-sm font-medium mb-3 italic">{product.urdu_name}</p>
        )}

        <div className="mt-auto">
          <PriceTag price={product.price} unit="kg" size="lg" />

          {!search && (
            <div className="flex gap-3 mt-4">
              <Link
                to={`/product/${product._id}`}
                className="flex-1 text-center py-2 px-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm"
              >
                Details
              </Link>
              <AddToCartButton product={product} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
