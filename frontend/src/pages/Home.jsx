import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Star, Truck, Shield } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/Product_Card";
import Image_Slider from "../components/Image_Silder";
import { slides } from "../assets/data";

const Home = () => {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <div>
      {/* Compact hero banner */}
      <Image_Slider slides={slides} />

      {/* Features strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On all orders" },
            { icon: Shield, title: "100% Organic", desc: "From Gilgit valleys" },
            { icon: Star, title: "Premium Quality", desc: "Handpicked selection" },
            { icon: TrendingUp, title: "Best Prices", desc: "Direct from farms" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-primary">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Our premium selection of dry fruits</p>
          </div>
          <Link to="/products/all" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-accent hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-bold">No products available yet</p>
            <p className="text-sm mt-1">Check back soon for our premium selection.</p>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link to="/products/all" className="inline-flex items-center gap-1.5 text-sm font-bold text-accent">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Bottom banner */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Natural Goodness, Delivered to Your Door</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-6">Order premium dry fruits from the mountains of Gilgit-Baltistan and enjoy free shipping.</p>
          <Link to="/products/all" className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 transition-colors">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
