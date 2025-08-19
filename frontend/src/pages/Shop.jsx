// src/pages/Shop.jsx
import { Images, Some_Fruits } from "../assets/data";
import Navbar from "../components/Navbar";
import ProductCard from "../components/Product_Card";
import Small_Banner from "../components/Small_Banner";

const Shop = () => {
  return (
    <div>
     
      {/* Banner Section */}
      <Small_Banner
        title="SHOP"
        subtitle="Here you will find all the items available in our store."
        bgImage={Images.shop_image}
        
      />

      {/* Products Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          All Products
        </h2>

        <div className="grid gap-8 px-2 sm:grid-cols-2 lg:grid-cols-3">
          {Some_Fruits.map((fruit) => (
            <ProductCard key={fruit.id} fruit={fruit} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
