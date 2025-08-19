import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Images } from "../assets/data";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-mint-50 to-white" id="about">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="sec_heading">
            About Gilgit Dry Fruits
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Bringing you the finest, organic dry fruits straight from the mountains of Gilgit. 
            Packed with nutrients, flavor, and health benefits for your everyday wellness.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={Images.image_4}
              alt="Gilgit Dry Fruits"
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center gap-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              From the Mountains to Your Home
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our dry fruits are carefully harvested from Gilgit’s fertile valleys, 
              where natural minerals and perfect climate produce premium quality nuts and fruits. 
              Each almond, walnut, apricot, and cherry is handpicked to ensure freshness and nutrition.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Rich in vitamins, healthy fats, and antioxidants, our products are ideal for a healthy lifestyle. 
              Enjoy the natural taste while boosting your immunity, brain health, and overall wellness.
            </p>

            {/* Info Icons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-2 text-gray-700">
                <FiMapPin className="text-2xl text-mint-500" />
                <span>Gilgit, Pakistan</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiPhone className="text-2xl text-mint-500" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiMail className="text-2xl text-mint-500" />
                <span>info@gilgitdryfruits.com</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                to="/products/all"
                className="inline-block font-medium px-6 py-3 rounded-full shadow transition w-max border text-black  hover:bg-transparent hover:text-mint-500 hover:scale-105"
              >
                Shop Now
              </Link>
              <a
                href="#contact"
                className="inline-block font-medium px-6 py-3 rounded-full shadow w-max border border-accent bg-accent text-mint-500 hover:bg-mint-500 hover:bg-accent/80 hover:scale-105 transition"

              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
