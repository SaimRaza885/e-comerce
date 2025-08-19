import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Logo & About */}
        <div>
          <h1 className="text-2xl font-bold text-accent mb-4">Gilgit Dry Fruits</h1>
          <p className="text-gray-400">
            Premium organic dry fruits sourced directly from the valleys of Gilgit. Freshness and quality guaranteed in every order.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-accent transition"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-accent transition"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-accent transition"><FiTwitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-accent transition">Home</Link></li>
            <li><Link to="/#product" className="hover:text-accent transition">Products</Link></li>
            <li><Link to="/products/all" className="hover:text-accent transition">Shop</Link></li>
            <li><Link to="/#about" className="hover:text-accent transition">About</Link></li>
            <li><Link to="/#contact" className="hover:text-accent transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FiMapPin className="text-accent" /> Gilgit, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-accent" /> +92 300 1234567
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-accent" /> info@gilgitdryfruits.com
            </li>
          </ul>
        </div>

      
      
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Gilgit Dry Fruits. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
