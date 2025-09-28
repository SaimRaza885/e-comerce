// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiMenu, FiX, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link, HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useCart } from "../context/Cart";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search = false }) {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalItems = cartItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const [isOpen, setIsOpen] = useState(false);           // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // mobile accordion / desktop dropdown
  const desktopDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // scroll handler (lightweight)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close dropdown on outside click (desktop)
  const handleClickOutside = useCallback((e) => {
    if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
    // if mobile menu open and clicked outside mobile menu -> close
    if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setIsOpen(false);
      setShowDropdown(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Helper to navigate from mobile dropdown reliably.
  // Navigate first, then close the mobile menu shortly after so navigation completes.
  const handleMobileNav = (path) => {
    if (!path) return;
    try {
      // console.log("Navigating to", path);
      navigate(path);
      // close after a tiny delay to avoid interrupting navigation
      setTimeout(() => {
        setIsOpen(false);
        setShowDropdown(false);
      }, 120);
    } catch (err) {
      console.error("Navigation error:", err);
      setIsOpen(false);
      setShowDropdown(false);
    }
  };

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        search ? "!bg-black !text-white static" : "fixed top-0"
      } ${scrolled ? "bg-white shadow-md text-black" : "bg-transparent text-white"}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Logo />
        </div>

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

          {/* Account / User Dropdown (desktop) */}
          <div className="relative" ref={desktopDropdownRef}>
            <FiUser
              size={22}
              className={`cursor-pointer hover:text-accent ${scrolled ? "text-black" : "text-white"}`}
              onClick={() => user && setShowDropdown((s) => !s)}
              aria-label="User menu"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && user && setShowDropdown((s) => !s)}
            />

            {!user && (
              // overlay link for quick login click (only when not logged in)
              <Link to="/login" className="absolute top-0 left-0 w-full h-full" aria-label="Login"></Link>
            )}

            {user && showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/account/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => {
            setIsOpen((s) => !s);
            // close mobile dropdown accordion when opening/closing the menu
            setShowDropdown(false);
          }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-black shadow-lg" ref={mobileMenuRef}>
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link to="/" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="block py-2 px-2 rounded hover:bg-gray-100">Home</Link>
            <HashLink smooth to="/#product" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="block py-2 px-2 rounded hover:bg-gray-100">Products</HashLink>
            <Link to="/products/all" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="block py-2 px-2 rounded hover:bg-gray-100">Shop</Link>
            <HashLink smooth to="/#about" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="block py-2 px-2 rounded hover:bg-gray-100">About</HashLink>
            <HashLink smooth to="/#contact" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="block py-2 px-2 rounded hover:bg-gray-100">Contact</HashLink>

            <hr className="border-gray-300 my-2" />

            <Link to="/search" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="flex items-center py-2 rounded hover:bg-gray-100">
              <Search className="w-6 h-6" />
              <span className="ml-2 font-medium">Search</span>
            </Link>

            <Link to="/cart" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="relative flex items-center py-2 rounded hover:bg-gray-100">
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
              <span className="ml-2 font-medium">Cart</span>
            </Link>

            {/* User Dropdown Accordion (mobile) */}
            <div className="flex flex-col">
              <button
                className="flex items-center py-2 rounded hover:bg-gray-100"
                onClick={() => user ? setShowDropdown((s) => !s) : (setIsOpen(false), navigate("/login"))}
                aria-expanded={showDropdown}
              >
                <FiUser size={22} />
                <span className="ml-2 font-medium">{user ? "Account" : "Login"}</span>
              </button>

              {!user && (
                <Link to="/login" onClick={() => { setIsOpen(false); setShowDropdown(false); }} className="pl-8 py-2 text-sm hover:bg-gray-100">Login</Link>
              )}

              {user && showDropdown && (
                <div className="flex flex-col pl-8 text-sm">
                  <button
                    onClick={() => handleMobileNav(user.role === "admin" ? "/admin/dashboard" : "/dashboard")}
                    className="py-2 text-left hover:bg-gray-100"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => handleMobileNav("/account/profile")}
                    className="py-2 text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => handleMobileNav("/logout")}
                    className="py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
