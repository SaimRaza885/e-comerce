import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import PriceTag from "./PriceTag";
import Animated_Borders from "./Animated_Borders";

const ProductCard = ({ product, search = false }) => {
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

  return (
    <div className="product_card group cursor-pointer">
<Animated_Borders/>
      {/* Product Image */}
      <div className="product_card-img">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <h3 className="product_card-title">{product.title}</h3>
      {product.urdu_name && (
        <p className="product_card-subtitle">{product.urdu_name}</p>
      )}

      <PriceTag price={product.price} unit="kg" size="lg" />

      {!search && (
        <div className="flex gap-2 mt-4">
          <Link to={`/product/${product._id}`} className="product_btn product_btn-yellow-outline">
            View
          </Link>
          <AddToCartButton product={product} />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
