import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Package, LayoutDashboard, PlusCircle } from "lucide-react";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, handleClickOutside]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="bg-primary text-white text-[11px] font-medium py-1.5 px-6 text-center tracking-wide">
        Free shipping on all orders | Premium dry fruits from Gilgit
      </div>

      <div className={`transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-primary hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-black text-primary tracking-tight">GB<span className="text-accent">DryFruits</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <Link to="/" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent rounded-lg hover:bg-gray-50 transition-colors">Home</Link>
            <Link to="/products/all" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent rounded-lg hover:bg-gray-50 transition-colors">Shop</Link>
            {user?.role !== "admin" && (
              <Link to="/my-orders" className="px-3 py-2 text-sm font-bold text-primary hover:text-accent rounded-lg hover:bg-gray-50 transition-colors">Orders</Link>
            )}

          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dry fruits..."
                className="w-full h-10 pl-4 pr-12 bg-gray-100 border-2 border-transparent rounded-lg text-sm text-primary outline-none focus:border-accent focus:bg-white transition-all"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-md flex items-center justify-center hover:bg-accent/90 transition-colors">
                <Search className="w-4 h-4 text-primary" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 ml-auto">
            <button onClick={() => navigate("/search")} className="md:hidden p-2 text-primary hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {user?.role !== "admin" && (
              <Link to="/cart" className="relative p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {accessToken && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-bold max-w-[80px] truncate">{user.fullName.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-primary">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      {user.role !== "admin" && (
                        <Link to="/my-orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link to="/product/create" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 rounded-xl transition-colors">
                          <PlusCircle className="w-4 h-4" /> New Product
                        </Link>
                      )}
                      <Link to={user.role === "admin" ? "/admin/dashboard" : "/account/profile"} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <div className="h-px bg-gray-100 my-1" />
                      <Link to="/logout" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
                        Logout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                <User className="w-4 h-4" /> <span className="hidden sm:block">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-black text-primary">GB<span className="text-accent">DryFruits</span></span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setIsOpen(false); } }} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 pl-4 pr-10 bg-gray-100 rounded-lg text-sm outline-none focus:border-accent"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              {[
                { name: "Home", path: "/" },
                { name: "Shop All Products", path: "/products/all" },
                ...(user?.role !== "admin" ? [
                  { name: "My Orders", path: "/my-orders" },
                  { name: "Cart", path: "/cart" },
                ] : []),
              ].map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-bold text-primary hover:bg-gray-50 rounded-xl transition-colors">
                  {link.name}
                </Link>
              ))}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-bold text-accent hover:bg-accent/10 rounded-xl transition-colors">
                    Admin Dashboard
                  </Link>
                  <Link to="/product/create" onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-bold text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                    + Add Product
                  </Link>
                </>
              )}
              {!accessToken && (
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="mt-4 px-4 py-3 text-base font-bold text-white bg-primary rounded-xl text-center">
                  Sign In
                </Link>
              )}
              {accessToken && (
                <Link to="/logout" onClick={() => setIsOpen(false)}
                  className="mt-4 px-4 py-3 text-base font-bold text-red-600 bg-red-50 rounded-xl text-center">
                  Logout
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
