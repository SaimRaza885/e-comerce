// // src/components/AdminProductCard.jsx
// import { FiEdit, FiTrash2 } from "react-icons/fi";

// const SkeletonBox = ({ className }) => (
//   <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
// );

// const AdminProductCard = ({ product, onEdit, onDelete, loading }) => {
//   // Format date safely using built-in Date API
//   const formattedDate = product?.createdAt
//     ? new Date(product.createdAt).toLocaleString("en-PK", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "—";

//   if (loading) {
//     return (
//       <tr className="border-b">
//         <td className="px-4 py-2"><SkeletonBox className="w-16 h-16" /></td>
//         <td className="px-4 py-2"><SkeletonBox className="w-28 h-4" /></td>
//         <td className="px-4 py-2"><SkeletonBox className="w-24 h-4" /></td>
//         <td className="px-4 py-2"><SkeletonBox className="w-16 h-4" /></td>
//         <td className="px-4 py-2"><SkeletonBox className="w-12 h-4" /></td>
//         <td className="px-4 py-2"><SkeletonBox className="w-20 h-5" /></td>
//         <td className="px-4 py-2 flex gap-2">
//           <SkeletonBox className="w-9 h-9 rounded-full" />
//           <SkeletonBox className="w-9 h-9 rounded-full" />
//         </td>
//         <td className="px-4 py-2"><SkeletonBox className="w-32 h-4" /></td>
//       </tr>
//     );
//   }

//   return (
//     <tr className="border-b hover:bg-gray-50 transition">
//       <td className="px-4 py-2">
//         <img
//           src={product?.images?.[0]?.url || "/images/placeholder.png"}
//           alt={product?.title || "No title"}
//           className="w-16 h-16 object-cover rounded shadow-sm"
//         />
//       </td>
//       <td className="px-4 py-2 font-medium">{product?.title}</td>
//       <td className="px-4 py-2">{product?.urdu_name}</td>
//       <td className="px-4 py-2">{product?.price} PKR</td>
//       <td className="px-4 py-2">{product?.stock}</td>
//       <td className="px-4 py-2">
//         {product?.inStock ? (
//           <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
//             In Stock
//           </span>
//         ) : (
//           <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
//             Out of Stock
//           </span>
//         )}
//       </td>
//       <td className="px-4 py-2 flex gap-2">
//         <button
//           onClick={() => onEdit(product._id)}
//           className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition shadow-sm"
//         >
//           <FiEdit />
//         </button>
//         <button
//           onClick={() => onDelete(product._id)}
//           className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition shadow-sm"
//         >
//           <FiTrash2 />
//         </button>
//       </td>
//       <td className="px-4 py-2 text-sm text-gray-600">{formattedDate}</td>
//     </tr>
//   );
// };

// export default AdminProductCard;


import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const AdminProductCard = ({ product, onEdit, onDelete, loading }) => {
  const [deleting, setDeleting] = useState(false);

  // Format date safely
  const formattedDate = product?.createdAt
    ? new Date(product.createdAt).toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(product._id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <tr className="border-b">
        <td className="px-4 py-2"><SkeletonBox className="w-16 h-16" /></td>
        <td className="px-4 py-2"><SkeletonBox className="w-28 h-4" /></td>
        <td className="px-4 py-2"><SkeletonBox className="w-24 h-4" /></td>
        <td className="px-4 py-2"><SkeletonBox className="w-16 h-4" /></td>
        <td className="px-4 py-2"><SkeletonBox className="w-12 h-4" /></td>
        <td className="px-4 py-2"><SkeletonBox className="w-20 h-5" /></td>
        <td className="px-4 py-2 flex gap-2">
          <SkeletonBox className="w-9 h-9 rounded-full" />
          <SkeletonBox className="w-9 h-9 rounded-full" />
        </td>
        <td className="px-4 py-2"><SkeletonBox className="w-32 h-4" /></td>
      </tr>
    );
  }

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2">
        <img
          src={product?.images?.[0]?.url || "/images/placeholder.png"}
          alt={product?.title || "No title"}
          className="w-16 h-16 object-cover rounded shadow-sm"
        />
      </td>
      <td className="px-4 py-2 font-medium">{product?.title}</td>
      <td className="px-4 py-2">{product?.urdu_name}</td>
      <td className="px-4 py-2">{product?.price} PKR</td>
      <td className="px-4 py-2">{product?.stock}</td>
      <td className="px-4 py-2">
        {product?.inStock ? (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            In Stock
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            Out of Stock
          </span>
        )}
      </td>
      <td className="px-4 py-2 flex gap-2">
        <button
          onClick={() => onEdit(product._id)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition shadow-sm"
        >
          <FiEdit />
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`p-2 rounded transition shadow-sm flex items-center justify-center
            ${deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          {deleting ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            <FiTrash2 />
          )}
        </button>
      </td>
      <td className="px-4 py-2 text-sm text-gray-600">{formattedDate}</td>
    </tr>
  );
};

export default AdminProductCard;
