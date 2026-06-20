import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/Product_Card";
import { Button } from "../components/ui";

const Shop = () => {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const { products, pagination, loading, error } = useProducts({ page, limit: 12 });

  const skeletons = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  ));

  let displayedProducts = [...products];
  if (sortOption === "priceLowHigh") displayedProducts.sort((a, b) => a.price - b.price);
  else if (sortOption === "priceHighLow") displayedProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-black text-primary">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total || 0} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-sm font-bold text-primary mb-4 bg-white px-4 py-2 rounded-xl border border-gray-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sidebar */}
          <div className={`lg:w-56 w-full flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-primary uppercase tracking-wider">Sort</h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSortOption("")}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortOption === "" ? "bg-accent/10 text-accent font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Default
                </button>
                <button
                  onClick={() => setSortOption("priceLowHigh")}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortOption === "priceLowHigh" ? "bg-accent/10 text-accent font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortOption("priceHighLow")}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortOption === "priceHighLow" ? "bg-accent/10 text-accent font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Price: High to Low
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium">{displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {skeletons}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      icon={<ChevronLeft className="w-4 h-4" />}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-bold text-primary px-4 py-2 bg-white rounded-xl border border-gray-100">
                      {page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                      disabled={page === pagination.totalPages}
                      icon={<ChevronRight className="w-4 h-4" />}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg font-bold text-primary mb-1">No products found</p>
                <p className="text-sm text-gray-400">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
