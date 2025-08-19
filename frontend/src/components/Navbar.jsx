import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import SearchBox from "./SearchBox";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBox, setshowBox] = useState(false);

  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (searchDesktopRef.current &&
          searchDesktopRef.current.contains(event.target)) ||
        (searchMobileRef.current &&
          searchMobileRef.current.contains(event.target))
      ) {
        return;
      }
      setshowBox(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md text-black"
          : " text-white bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-accent">Gilgit Dry Fruits</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium">
          <li>
            <Link to={"/"} className="block hover:text-accent">
              Home
            </Link>
          </li>
          <li>
            <HashLink smooth to="/#product" className="hover:text-accent">
              Products
            </HashLink>
          </li>
          <li>
            <Link to={"products/all"} className="block hover:text-accent">
              Shop
            </Link>
          </li>
          <li>
            <HashLink smooth to="/#about" className="hover:text-accent">
              About
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="/#contact" className="hover:text-accent">
              Contact
            </HashLink>
          </li>
        </ul>

        {/* Search Icon (Desktop) */}
        <div className="hidden md:block relative">
          {!showBox && (
            <FiSearch
              size={22}
              className={`hover:text-accent cursor-pointer ${
                scrolled ? "text-black" : "text-white"
              }`}
              onClick={() => setshowBox(true)}
            />
          )}

          {/* Search Box Modal */}
          {/* {showBox && <SearchBox showBox={setshowBox} />} */}
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
      {isOpen && (
        <div className="md:hidden bg-primary px-6 py-4 space-y-4 shadow-lg">
          <a href="#" className="block hover:text-accent">
            Home
          </a>
          <a href="#products" className="block hover:text-accent">
            Products
          </a>
          <Link to={"products/all"} className="block hover:text-accent">
            Shop
          </Link>
          <a href="#about" className="block hover:text-accent">
            About
          </a>
          <a href="#contact" className="block hover:text-accent">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
