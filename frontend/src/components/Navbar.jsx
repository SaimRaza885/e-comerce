import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useCart } from "../context/Cart";
import { Search } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search = false }) {
  const { cartItems } = useCart();
  const { user } = useAuth()
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchRef = useRef(null);




  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown/search if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={` w-full z-50 transition-all duration-300 ${search ? "!bg-black !text-white static " : "fixed top-0"
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
          {/* Search */}
          {!search && (
            <Link to="/search" className="p-2 hover:text-accent rounded-full">
              <Search className="w-6 h-6" />
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-accent">
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account / User Dropdown */}
          <div className="relative" ref={searchRef}>
            <FiUser
              size={22}
              className={`cursor-pointer hover:text-accent ${scrolled ? "text-black" : "text-white"}`}
             onClick={() => user && setShowDropdown(!showDropdown)}
            />
            {!user && (
              <Link to="/login" className="absolute top-0 left-0 w-full h-full"></Link>
            )}
            {user  && showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <Link to={`${user.role === "admin" ? "admin/dashboard" : "/dashboard"}`} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/account/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
{isOpen && (
  <div className="md:hidden bg-white text-black shadow-lg">
    <div className="flex flex-col px-6 py-4 space-y-4">
      {/* Navigation Links */}
      <Link to="/" className="block py-2 px-2 rounded hover:bg-gray-100">Home</Link>
      <HashLink smooth to="/#product" className="block py-2 px-2 rounded hover:bg-gray-100">Products</HashLink>
      <Link to="/products/all" className="block py-2 px-2 rounded hover:bg-gray-100">Shop</Link>
      <HashLink smooth to="/#about" className="block py-2 px-2 rounded hover:bg-gray-100">About</HashLink>
      <HashLink smooth to="/#contact" className="block py-2 px-2 rounded hover:bg-gray-100">Contact</HashLink>

      {/* Divider */}
      <hr className="border-gray-300 my-2" />

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2">
        {/* Search */}
        <Link to="/search" className="flex-1 flex items-center justify-center py-2 rounded hover:bg-gray-100">
          <Search className="w-6 h-6" />
          <span className="ml-2 font-medium">Search</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative flex-1 flex items-center justify-center py-2 rounded hover:bg-gray-100 mx-2">
          <FiShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
          <span className="ml-2 font-medium">Cart</span>
        </Link>

        {/* User */}
        <div className="relative flex-1 flex items-center justify-center py-2 rounded hover:bg-gray-100">
          <FiUser
            size={22}
            className="cursor-pointer"
            onClick={() => user && setShowDropdown(!showDropdown)}
          />
          {!user && <Link to="/login" className="absolute inset-0 w-full h-full"></Link>}

          {/* Dropdown */}
          {user && showDropdown && (
            <div className="absolute top-full mt-2 w-40 right-0 bg-white text-black rounded shadow-lg z-50">
              <Link to={`${user.role === "admin" ? "/admin/dashboard" : "/dashboard"}`} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/account/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </nav>
  );
}
