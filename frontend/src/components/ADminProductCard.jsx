// src/components/AdminProductCard.jsx
import { FiEdit, FiTrash2 } from "react-icons/fi";

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2">
        <img
          src={product.images?.[0]?.url || "/images/placeholder.png"}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
        />
      </td>
      <td className="px-4 py-2 font-medium">{product.title}</td>
      <td className="px-4 py-2">{product.urdu_name}</td>
      <td className="px-4 py-2">{product.price} PKR</td>
      <td className="px-4 py-2">{product.stock}</td>
      <td className="px-4 py-2">
        {product.inStock ? (
          <span className="text-green-600 font-medium">In Stock</span>
        ) : (
          <span className="text-red-600 font-medium">Out of Stock</span>
        )}
      </td>
      <td className="px-4 py-2 flex gap-2">
        <button
          onClick={() => onEdit(product._id)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
};

export default AdminProductCard;
