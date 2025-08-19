// src/pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { Images, Some_Fruits } from "../assets/data";
import Small_Banner from "../components/Small_Banner";


const ProductDetails = () => {
  const { id } = useParams();
  const fruit = Some_Fruits.find((f) => f.id === id);

  if (!fruit) {
    return <div className="text-center py-20 text-gray-500">Product not found</div>;
  }

  return (
    <>
    <Small_Banner title={id} subtitle={"Fresh, organic dry fruits directly from Gilgit Baltistan"} bgImage={Images.image_1}  />
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image placeholder */}
        <div className="w-full h-80 bg-mint-100 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400">Image</span>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{fruit.name}</h1>
          <p className="text-gray-500 text-lg mb-2">{fruit.urdu}</p>
          <p className="text-2xl text-mint-600 font-semibold mb-6">
            {fruit.pricePerKg} PKR / kg
          </p>
          <p className="text-gray-700 mb-6">{fruit.description}</p>

          <a
            href={`https://wa.me/923001234567?text=Hi! I want to order ${fruit.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-mint-500 font-medium px-6 py-3 rounded-full shadow hover:bg-mint-600 transition"
            >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
            </>
  );
};

export default ProductDetails;
