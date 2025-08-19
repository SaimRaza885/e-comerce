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
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProductCard = ({ fruit }) => {
  return (
    <div className="relative group w-full bg-white shadow-lg p-6 flex flex-col items-center cursor-pointer overflow-hidden transition-transform hover:scale-105 hover:shadow-xl ">
      {/* 4 Animated Borders */}
      <span className="absolute left-0 top-0 w-[3px] h-full bg-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
      <span className="absolute right-0 top-0 w-[3px] h-full bg-emerald-600 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
      <span className="absolute left-0 top-0 h-[3px] w-full bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
      <span className="absolute left-0 bottom-0 h-[3px] w-full bg-emerald-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>

      {/* Image placeholder */}
      <div className="w-40 h-40 bg-mint-100 rounded-xl flex items-center justify-center mb-4 relative z-10">
        <span className="text-gray-400">Image</span>
      </div>

      {/* Info */}
      <h3 className="text-xl font-semibold text-gray-800 relative z-10">
        {fruit.name}
      </h3>
      <p className="text-sm text-gray-500 mb-2 relative z-10">{fruit.urdu}</p>
      <p className="text-lg font-medium text-mint-600 mb-2 relative z-10">
        {fruit.pricePerKg} PKR / kg
      </p>

      {/* Buttons */}
      <div className="flex gap-2 mt-2 relative z-10">
        <Link
          to={`/product/${fruit.id}`}
          className="text-sm px-4 py-2 rounded-full border border-mint-500 text-mint-600   hover:scale-105 transition"
        >
          View
        </Link>
        <a
          href={`https://wa.me/923001234567?text=Hi! I want to order ${fruit.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-mint-500 hover:bg-accent/20 text-sm px-4 py-2 rounded-full shadow-md transition"
        >
          <FiShoppingCart /> Buy
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
