// src/components/ProductSection.jsx
import { Some_Fruits } from "../assets/data";
import ProductCard from "../components/Product_Card";
import { Link } from "react-router-dom";

const ProductSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-mint-50" id="product">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our Premium Dry Fruits
        </h2>
        <p className="mt-2 text-gray-600">
          Straight from Gilgit’s mountains — pure, organic, and healthy.
        </p>
      </div>

      {/* Show only 4 products */}
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Some_Fruits.slice(0, 4).map((fruit) => (
          <ProductCard key={fruit.id} fruit={fruit} />
        ))}
      </div>

      {/* Show All Button */}
      <div className="text-center mt-10">
        <Link
          to="/product/all"
          className="inline-block bg-accent text-black font-medium px-6 py-3 rounded-full shadow hover:bg-mint-600 transition"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;
