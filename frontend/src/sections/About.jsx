import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import { Images } from "../assets/data";

const AboutSection = () => {
  return (
    <section className="py-24 bg-cream/50 overflow-hidden" id="about">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image with Decorative Elements */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float border-8 border-white">
              <img
                src={Images.image_4}
                alt="Gilgit Dry Fruits"
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>

            {/* Stats Overlay */}
            <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-xl hidden md:block z-20">
              <p className="text-3xl font-black text-primary">100%</p>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Organic & Pure</p>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            <div>
              <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Heritage</span>
              <h2 className="heading-lg text-primary mb-6">
                Directly from the <span className="text-secondary italic">Golden Valley</span> of Gilgit
              </h2>
              <div className="w-20 h-1.5 bg-accent rounded-full mb-8"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              Nestled between the world's most majestic mountains, our dry fruits are nourished by crystal-clear glacial waters and pure Himalayan air. Each harvest is a testament to Gilgit's rich agricultural legacy.
            </p>

            <p className="text-gray-600 leading-relaxed">
              We specialize in sun-dried apricots, heart-healthy walnuts, and rare mountain almonds. Our process remains traditional, ensuring that every bite delivers the authentic taste and maximum nutritional potency that nature intended.
            </p>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {[
                { icon: <FiMapPin />, text: "Gilgit, Pakistan", label: "Origin" },
                { icon: <FiPhone />, text: "+92 300 1234567", label: "Contact" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-cream text-secondary rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-primary">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/products/all" className="btn-premium group">
                Explore Collection
                <FiArrowRight className="ml-2 group-hover:translate-x-1" />
              </Link>
              <HashLink smooth to="/#contact" className="btn-premium-outline">
                Inquire Now
              </HashLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
