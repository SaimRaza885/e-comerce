// // src/components/ProductCard.jsx
// import { FiShoppingCart } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const ProductCard = ({ fruit }) => {
//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl">
//       {/* Image placeholder */}
//       <div className="w-40 h-40 bg-mint-100 rounded-xl flex items-center justify-center mb-4">
//         <span className="text-gray-400">Image</span>
//       </div>

//       {/* Info */}
//       <h3 className="text-xl font-semibold text-gray-800">{fruit.name}</h3>
//       <p className="text-sm text-gray-500 mb-2">{fruit.urdu}</p>
//       <p className="text-lg font-medium text-mint-600 mb-2">
//         {fruit.pricePerKg} PKR / kg
//       </p>

//       {/* Buttons */}
//       <div className="flex gap-2 mt-2">
//         <Link
//           to={`/products/${fruit.id}`}
//           className="text-sm px-4 py-2 rounded-full border border-mint-500 text-mint-600 hover:bg-mint-500 hover:text-white hover:border-white hover:bg-amber-800  transition"
//         >
//           View
//         </Link>
//         <a
//           href={`https://wa.me/923001234567?text=Hi! I want to order ${fruit.name}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-flex items-center gap-1 bg-mint-500 hover:bg-mint-600 text-sm px-4 py-2 rounded-full shadow-md transition"
//         >
//           <FiShoppingCart /> Buy
//         </a>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product, search = false }) => {


  return (
    <div className="relative group bg-white shadow-lg p-4 flex flex-col items-center cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105 hover:shadow-2xl">
      {/* 4 Animated Borders */}

      <span className="absolute right-0 top-0 w-[3px] h-full bg-green-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
      <span className="absolute left-0 top-0 w-[3px] h-full bg-yellow-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
      <span className="absolute left-0 top-0 h-[3px] w-full bg-yellow-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
      <span className="absolute left-0 bottom-0 h-[3px] w-full bg-green-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>

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

      <p className="text-lg font-bold 0 mb-1">{product.price} PKR / kg</p>
      {!search && (
        <>
          <p
            className={`text-sm font-medium mb-2 ${product.inStock ? "text-green-700" : "text-red-700"
              }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <Link
              to={`/product/${product._id}`}
              className="text-sm px-4 py-2 rounded-full border border-yellow-500 text-yellow-700 hover:bg-yellow-50 transition"
            >
              View
            </Link>
            <a
              href={`https://wa.me/923001234567?text=Hi! I want to order ${product.title}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy on WhatsApp"
              className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-full shadow-md transition"
            >
              <FiShoppingCart /> Buy
            </a>
          </div>
        </>
      )}

    </div>
  );
};

export default ProductCard;

