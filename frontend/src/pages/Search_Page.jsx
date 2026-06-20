import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/Product_Card";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/product/all");
        const data = Array.isArray(res.data.data?.products) ? res.data.data.products : [];
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = query.trim()
    ? products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : products;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search header */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dry fruits..."
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-primary outline-none focus:border-accent focus:bg-white transition-all text-sm"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setSearchParams({}); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query || "all products"}"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} search={true} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-bold text-primary mb-1">No results for "{query}"</p>
            <p className="text-sm text-gray-400">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
