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
      className={`w-full z-50 transition-all duration-300 ${search ? "!bg-black !text-white static" : "fixed top-0"
        } ${scrolled ? "bg-white shadow-md text-black" : "bg-transparent text-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium">
          <li><Link to="/" className="hover:text-accent">Home</Link></li>
          <li><HashLink smooth to="/#product" className="hover:text-accent">Products</HashLink></li>
          <li><Link to="/products/all" className="hover:text-accent">Shop</Link></li>
          <li><HashLink smooth to="/#about" className="hover:text-accent">About</HashLink></li>
          <li><HashLink smooth to="/#contact" className="hover:text-accent">Contact</HashLink></li>
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6">
          {!search && (
            <Link to="/search" className="p-2 hover:text-accent rounded-full" aria-label="Search">
              <Search className="w-6 h-6" />
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-accent" aria-label="Cart">
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Dropdown (Desktop) */}
          {accessToken && (


            <div className="relative" ref={desktopDropdownRef}>
              <FiUser
                size={22}
                className={`cursor-pointer hover:text-accent ${scrolled ? "text-black" : "text-white"}`}
                onClick={() => user && setShowDesktopDropdown((prev) => !prev)}
              />

              {user && showDesktopDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/account/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-black shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded hover:bg-gray-100">Home</Link>
            <HashLink smooth to="/#product" onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded hover:bg-gray-100">Products</HashLink>
            <Link to="/products/all" onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded hover:bg-gray-100">Shop</Link>
            <HashLink smooth to="/#about" onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded hover:bg-gray-100">About</HashLink>
            <HashLink smooth to="/#contact" onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded hover:bg-gray-100">Contact</HashLink>

            <hr className="border-gray-300 my-2" />

            <Link to="/search" onClick={() => setIsOpen(false)} className="flex items-center py-2 rounded hover:bg-gray-100">
              <Search className="w-6 h-6" />
              <span className="ml-2 font-medium">Search</span>
            </Link>

            <Link to="/cart" onClick={() => setIsOpen(false)} className="relative flex items-center py-2 rounded hover:bg-gray-100">
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
              <span className="ml-2 font-medium">Cart</span>
            </Link>

            {/* Mobile User Dropdown */}
            {accessToken && (


              <div className="flex flex-col">
                <button
                  className="flex items-center py-2 rounded hover:bg-gray-100"
                  onClick={() => user && setShowMobileDropdown((prev) => !prev)}
                >
                  <FiUser size={22} />
                  <span className="ml-2 font-medium">{user ? "Account" : "Login"}</span>
                </button>



                {user && showMobileDropdown && (
                  <div className="flex flex-col pl-8 text-sm">
                    <Link
                      to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                      onClick={() => {
                        setIsOpen(false);
                        setShowMobileDropdown(false);
                      }}
                      className="py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/account/profile"
                      onClick={() => {
                        setIsOpen(false);
                        setShowMobileDropdown(false);
                      }}
                      className="py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/logout"
                      onClick={() => {
                        setIsOpen(false);
                        setShowMobileDropdown(false);
                      }}
                      className="py-2 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
