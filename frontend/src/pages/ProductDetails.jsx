import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import api from "../api/axios";
import ProductImages from "../components/ProductImages";
import { useCart } from "../context/Cart";
import Small_Banner from "../components/Small_Banner";
import PriceTag from "../components/PriceTag";
import Product_Details_SkeletonLoader from "../components/Product_Details_SkeletonLoader";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart(); // use cart context

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.data);
        console.log(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((q) => q + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // alert(`${quantity} x ${product.title} added to cart!`);
  };

  if (loading) return <Product_Details_SkeletonLoader />

  if (error)
    return (
      <div className="text-center py-20 text-red-600">{error}</div>
    );

  if (!product) return null;

  return (
    <>
      <Small_Banner title={product.urdu_name} bgImage={product.images[0].url} subtitle={""} />
      <div className="container-section">
        <div className="product-layout">
          <ProductImages images={product.images || []} />

          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            {product.urdu_name && <p className="product-subtitle">{product.urdu_name}</p>}

            <PriceTag price={product.price} size="xl" unit="kg" isBlack={true} />

            <p className={`text-sm font-medium mb-4 ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {product.description && <p className="product-description">{product.description}</p>}

            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => handleQuantityChange("decrement")} className="qty-btn"><FiMinus /></button>
              <span className="text-lg font-medium">{quantity}</span>
              <button onClick={() => handleQuantityChange("increment")} className="qty-btn"><FiPlus /></button>
            </div>

            <div className="total-box">
              <span className="text-gray-700 font-medium text-lg">Total Price:</span>
              <span className="text-yellow-600 font-bold text-xl">
                <PriceTag price={product.price * quantity} size="md" />
              </span>
            </div>

            <div className="action-btns">
              <button onClick={handleAddToCart} className="btn-cart">
                <FiShoppingCart /> Add to Cart
              </button>

              <a
                href={`https://wa.me/923001234567?text=Hi! I want to order ${quantity} x ${product.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <FiShoppingCart /> Buy on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ProductDetail;
