
// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import AddToCartButton from "./AddToCartButton";
import PriceTag from "./PriceTag";

const ProductCard = ({ product, search = false }) => {


  return (
    <div className="relative group bg-white/15 shadow-lg p-4 flex flex-col items-center cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105 hover:shadow-2xl">
      {/* 4 Animated Borders */}


      {/* Product Image */}
      <div className=" w-full    h-56 rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
        <img
          src={product.images[0].url}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/images/placeholder.png")}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">{product.title}</h3>
      {product.urdu_name && (
        <p className="text-sm text-gray-500 mb-1 text-center">{product.urdu_name}</p>
      )}

     <PriceTag price={product.price} unit="kg" size="lg" />


      {!search && (
        <>
          

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Link
              to={`/product/${product._id}`}
              className="text-sm px-4 py-1 rounded-full border border-yellow-500 text-yellow-700 hover:bg-yellow-50 transition"
            >
              View
            </Link>
            {/* <a
              href={`https://wa.me/923001234567?text=Hi! I want to order ${product.title}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy on WhatsApp"
              className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-full shadow-md transition"
            >
              <FiShoppingCart /> Buy
            </a> */}

            <AddToCartButton product={product} />
          </div>
        </>
      )}

    </div>
  );
};

export default ProductCard;

