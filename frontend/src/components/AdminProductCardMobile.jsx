const AdminProductCardMobile = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-3">
      <div className="flex gap-4 items-center">
        <img
          src={product.images?.[0]?.url || "/images/placeholder.png"}
          alt={product.title}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h2 className="font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-500">{product.urdu_name}</p>
          <p className="text-sm">{product.price} PKR</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span>Stock: {product.stock}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {new Date(product.createdAt).toLocaleDateString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product._id)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCardMobile;
