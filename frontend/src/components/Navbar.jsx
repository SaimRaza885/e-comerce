import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiMenu, FiX, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Search } from "lucide-react";
import { useCart } from "../context/Cart";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search = false }) {
  const { cartItems } = useCart();
  const { user, accessToken } = useAuth();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const desktopDropdownRef = useRef(null);

  // ✅ Sticky nav background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Outside click for desktop dropdown
  const handleClickOutside = useCallback((event) => {
    if (
      desktopDropdownRef.current &&
      !desktopDropdownRef.current.contains(event.target)
    ) {
      setShowDesktopDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (showDesktopDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDesktopDropdown, handleClickOutside]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass py-2 shadow-xl" : "bg-transparent py-4 text-white"} ${search ? "!bg-primary !text-white !py-2" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Logo scrolled={scrolled || search} />

        {/* Desktop Menu */}
        <ul className={`hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase items-center ${scrolled || search ? "text-primary" : "text-white"
          }`}>
          <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
          <li><HashLink smooth to="/#product" className="hover:text-accent transition-colors">Products</HashLink></li>
          <li><Link to="/products/all" className="hover:text-accent transition-colors">Shop</Link></li>
          <li><HashLink smooth to="/#about" className="hover:text-accent transition-colors">About</HashLink></li>
          <li><HashLink smooth to="/#contact" className="hover:text-accent transition-colors">Contact</HashLink></li>
        </ul>

        {/* Desktop Icons */}
        <div className={`hidden md:flex items-center gap-8 ${scrolled || search ? "text-primary" : "text-white"
          }`}>
          {!search && (
            <Link to="/search" className="p-2 hover:text-accent transition-all hover:scale-110" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-accent transition-all hover:scale-110" aria-label="Cart">
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Dropdown (Desktop) */}
          {accessToken && (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                className="flex items-center gap-2 p-2 hover:text-accent transition-all"
                onClick={() => user && setShowDesktopDropdown((prev) => !prev)}
              >
                <FiUser size={22} />
                {user && <span className="text-xs font-bold uppercase tracking-tighter">{user.fullName.split(' ')[0]}</span>}
              </button>

              {user && showDesktopDropdown && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-cream border-b border-gray-100">
                    <p className="text-sm font-bold text-primary">{user.fullName}</p>
                    <p className="text-xs text-secondary truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream rounded-xl transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/account/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream rounded-xl transition-colors">Profile</Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <Link to="/logout" className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">Logout</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={`md:hidden p-2 rounded-xl transition-colors ${scrolled || search ? "text-primary hover:bg-cream" : "text-white hover:bg-white/10"
          }`} onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-500" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <Logo scrolled={true} />
              <button onClick={() => setIsOpen(false)} className="p-2 text-primary hover:bg-cream rounded-xl">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/#product", hash: true },
                { name: "Shop", path: "/products/all" },
                { name: "About", path: "/#about", hash: true },
                { name: "Contact", path: "/#contact", hash: true },
              ].map((link) => (
                link.hash ? (
                  <HashLink key={link.name} smooth to={link.path} onClick={() => setIsOpen(false)} className="text-xl font-bold text-primary hover:text-accent transition-colors">
                    {link.name}
                  </HashLink>
                ) : (
                  <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-xl font-bold text-primary hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                )
              ))}

              <hr className="border-gray-100 my-4" />

              <Link to="/search" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-xl font-bold text-primary hover:text-accent transition-colors">
                <Search className="w-6 h-6" />
                <span>Search</span>
              </Link>

              <Link to="/cart" onClick={() => setIsOpen(false)} className="relative flex items-center gap-4 text-xl font-bold text-primary hover:text-accent transition-colors">
                <FiShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute left-4 -top-2 bg-accent text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
                <span>Cart</span>
              </Link>

              {/* Mobile Profile Section */}
              {accessToken && user && (
                <>
                  <hr className="border-gray-100 my-4" />
                  <div className="bg-cream rounded-3xl p-6">
                    <p className="text-sm font-bold text-primary mb-1">{user.fullName}</p>
                    <p className="text-xs text-secondary mb-4 truncate">{user.email}</p>
                    <div className="flex flex-col gap-3">
                      <Link
                        to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-primary hover:text-accent"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/account/profile"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-primary hover:text-accent"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/logout"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-red-600"
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
