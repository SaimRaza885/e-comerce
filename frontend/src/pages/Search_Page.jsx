import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/Product_Card";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Filters
    const [sortOption, setSortOption] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Fetch all products once
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/product/all`);
                const data = res.data.data || [];
                setProducts(data);
                setFilteredProducts(data);

                // unique categories
                const cats = [...new Set(data.map((p) => p.category || "Other"))];
                setCategories(cats);
            } catch (err) {
                setMessage(err.response?.data?.message || "Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply search + filters + sorting
    useEffect(() => {
        let updated = [...products];

        // Search
        if (query.trim()) {
            const lower = query.toLowerCase();
            updated = updated.filter(
                (p) =>
                    p.title.toLowerCase().includes(lower)
            );
        }

        // Stock filter
        if (stockFilter === "in") {
            updated = updated.filter((p) => p.stock > 0);
        } else if (stockFilter === "out") {
            updated = updated.filter((p) => p.stock === 0);
        }

        // Category filter
        // if (selectedCategory !== "all") {
        //   updated = updated.filter((p) => p.category === selectedCategory);
        // }

        // Price filter
        updated = updated.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // Sorting
        if (sortOption === "priceLowHigh") {
            updated.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHighLow") {
            updated.sort((a, b) => b.price - a.price);
        } else if (sortOption === "titleAZ") {
            updated.sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredProducts(updated);
    }, [products, query, sortOption, stockFilter, priceRange, selectedCategory]);

    return (
        <>
            <Navbar search={true} />
            <div className="min-h-screen bg-gray-50 p-6 my-5">

                <div className="max-w-6xl mx-auto flex gap-6 my-10  flex-col sm:flex-row">
                    {/* Sidebar Filters */}
                    <div className="sm:w-64 bg-white shadow-lg rounded-xl p-5 h-fit sm:sticky w-full top-6">
                        <h3 className="font-bold text-lg mb-4">Filters</h3>

                        {/* Price Range */}
                        <div className="mb-5">
                            <label className="block font-medium text-gray-700 mb-2">
                                Price Range ({priceRange[0]} - {priceRange[1]} PKR)
                            </label>

                            {/* Slider */}
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="500"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                                }
                                className="w-full accent-yellow-500"
                            />

                            {/* Min Price Input */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-gray-600 text-sm">Min:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max={priceRange[1]} // Prevents min > max
                                    step="100"
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                                    }
                                    className="w-28 border rounded-lg p-2 text-sm focus:ring focus:ring-yellow-300"
                                />
                                <span className="text-sm text-gray-500">PKR</span>
                            </div>

                            {/* Max Price Input */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-gray-600 text-sm">Max:</span>
                                <input
                                    type="number"
                                    min={priceRange[0]} // Prevents max < min
                                    max="10000"
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                                    }
                                    className="w-28 border rounded-lg p-2 text-sm focus:ring focus:ring-yellow-300"
                                />
                                <span className="text-sm text-gray-500">PKR</span>
                            </div>
                        </div>


                        {/* Stock Filter */}
                        <div className="mb-5">
                            <label className="block font-medium text-gray-700 mb-2">Stock</label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option value="all">All</option>
                                <option value="in">In Stock</option>
                                <option value="out">Out of Stock</option>
                            </select>
                        </div>

                      

                        {/* Sort By */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option value="">Default</option>
                                <option value="priceLowHigh">Price: Low to High</option>
                                <option value="priceHighLow">Price: High to Low</option>
                                <option value="titleAZ">Title: A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Input */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-blue-300"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>

                        {/* Product Results */}
                        {loading ? (
                            <p className="text-gray-500">Loading products...</p>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((p) => (
                                    <Link key={p._id} to={`/product/${p._id}`}>
                                        <ProductCard product={p} search={true} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No products found</p>
                        )}

                        {message && (
                            <p className="text-red-600 text-center mt-3">{message}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
