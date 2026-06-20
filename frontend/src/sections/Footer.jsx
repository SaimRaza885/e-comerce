import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white/80">
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-black text-accent mb-4">GB Dry Fruits</h3>
          <p className="text-white/60 leading-relaxed text-sm">
            Premium organic dry fruits sourced directly from the pristine valleys of Gilgit-Baltistan. Freshness and quality guaranteed.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { name: "Home", path: "/" },
              { name: "Products", path: "/#product", hash: true },
              { name: "Shop", path: "/products/all" },
              { name: "About", path: "/#about", hash: true },
              { name: "Contact", path: "/#contact", hash: true },
            ].map((link) => (
              <li key={link.name}>
                {link.hash ? (
                  <HashLink smooth to={link.path} className="text-white/60 hover:text-accent transition-colors text-sm font-medium">
                    {link.name}
                  </HashLink>
                ) : (
                  <Link to={link.path} className="text-white/60 hover:text-accent transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Customer Service</h4>
          <ul className="space-y-3">
            {[
              { name: "My Account", path: "/dashboard" },
              { name: "My Orders", path: "/my-orders" },
              { name: "Shopping Cart", path: "/cart" },
              { name: "FAQ", path: "/#faq", hash: true },
            ].map((link) => (
              <li key={link.name}>
                {link.hash ? (
                  <HashLink smooth to={link.path} className="text-white/60 hover:text-accent transition-colors text-sm font-medium">
                    {link.name}
                  </HashLink>
                ) : (
                  <Link to={link.path} className="text-white/60 hover:text-accent transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-white/60 text-sm">Gilgit, Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent flex-shrink-0" />
              <a href="tel:+923001234567" className="text-white/60 hover:text-accent transition-colors text-sm">+92 300 1234567</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent flex-shrink-0" />
              <a href="mailto:info@gilgitdryfruits.com" className="text-white/60 hover:text-accent transition-colors text-sm">info@gilgitdryfruits.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6 text-center text-white/40 text-xs font-medium">
          &copy; {year} GB Dry Fruits. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
