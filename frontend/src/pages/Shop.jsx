import { useState } from "react";
import ProductCard from "../components/Product_Card";
import Small_Banner from "../components/Small_Banner";
import { Images } from "../assets/data";
import { useProducts } from "../hooks/useProducts";


const Shop = () => {
  const [page, setPage] = useState(1);
  const { products, pagination, loading, error } = useProducts({ page, limit: 6 });

  // Skeleton Loader
  const renderSkeletons = () => (
    <div className="grid gap-8 px-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg shadow p-4 animate-pulse"
        >
          <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Small_Banner
        title="SHOP"
        subtitle="Explore our selection of premium dry fruits from Gilgit."
        bgImage={Images.shop_image1}
      />

      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          All Products
        </h2>

        {error && <div className="text-center text-red-600 mb-8">{error}</div>}

        {loading ? (
          renderSkeletons()
        ) : (
          <>
            <div className="grid gap-8 px-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No products found.
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
