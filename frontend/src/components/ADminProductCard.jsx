// src/components/AdminProductCard.jsx
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const AdminProductCard = ({ product, onEdit, onDelete, loading }) => {
  // Format date safely using built-in Date API
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
          onClick={() => onDelete(product._id)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition shadow-sm"
        >
          <FiTrash2 />
        </button>
      </td>
      <td className="px-4 py-2 text-sm text-gray-600">{formattedDate}</td>
    </tr>
  );
};

export default AdminProductCard;
