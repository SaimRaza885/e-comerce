import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useCart } from "../context/Cart";
import { LogIn, Search } from "lucide-react";
import Logo from "./Logo";

export default function Navbar({ search }) {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${searchQuery}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${search ? "!bg-black" : ""} ${scrolled ? "bg-white shadow-md text-black" : "bg-transparent text-white"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        {/* <h1 className="text-2xl font-bold text-accent">Gilgit Dry Fruits</h1> */}
        <Logo />
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-accent">Home</Link>
          </li>
          <li>
            <HashLink smooth to="/#product" className="hover:text-accent">Products</HashLink>
          </li>
          <li>
            <Link to="/products/all" className="hover:text-accent">Shop</Link>
          </li>
          <li>
            <HashLink smooth to="/#about" className="hover:text-accent">About</HashLink>
          </li>
          <li>
            <HashLink smooth to="/#contact" className="hover:text-accent">Contact</HashLink>
          </li>
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          {!search && (

            <Link to="/search" className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-6 h-6 text-gray-700" />
            </Link>
          )

          }

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link to="/login">
            <FiUser
              size={22}
              className={`cursor-pointer hover:text-accent ${scrolled ? "text-black" : "text-white"
                }`}
            />
          </Link>


        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {
        isOpen && (
          <div className="md:hidden bg-primary px-6 py-4 space-y-4 shadow-lg text-white">
            <Link to="/" className="block hover:text-accent">Home</Link>
            <a href="#products" className="block hover:text-accent">Products</a>
            <Link to="/products/all" className="block hover:text-accent">Shop</Link>
            <a href="#about" className="block hover:text-accent">About</a>
            <a href="#contact" className="block hover:text-accent">Contact</a>

            {/* Mobile Icons */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-300">
              <FiSearch
                size={22}
                className="cursor-pointer hover:text-accent"
                onClick={() => setShowBox(!showBox)}
              />
              <Link to="/login">
                <FiUser size={22} className="cursor-pointer hover:text-accent" />
              </Link>
              <Link to="/cart" className="relative">
                <FiShoppingCart size={22} className="cursor-pointer hover:text-accent" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )
      }
    </nav >
  );
}
