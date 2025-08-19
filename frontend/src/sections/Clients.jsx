import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FiSmile, FiPackage, FiAward } from "react-icons/fi";

const HappyClientsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="sec_heading mb-10">
          Our Achievements
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* Happy Clients */}
          <div className="flex flex-col items-center gap-3">
            <FiSmile className="text-4xl text-amber-400" />
            <h3 className="text-4xl font-extrabold text-gray-800">
              {inView ? <CountUp end={1200} duration={2} separator="," /> : "0"}+
            </h3>
            <p className="text-gray-600 mt-1">Happy Clients</p>
          </div>

          {/* Total Orders / Deliveries */}
          <div className="flex flex-col items-center gap-3">
            <FiPackage className="text-4xl text-orange-500" />
            <h3 className="text-4xl font-extrabold text-gray-800">
              {inView ? <CountUp end={3500} duration={2} separator="," /> : "0"}+
            </h3>
            <p className="text-gray-600 mt-1">Deliveries Done</p>
          </div>

          {/* Years of Experience */}
          <div className="flex flex-col items-center gap-3">
            <FiAward className="text-4xl text-blue-500" />
            <h3 className="text-4xl font-extrabold text-gray-800">
              {inView ? <CountUp end={5} duration={2} /> : "0"}+
            </h3>
            <p className="text-gray-600 mt-1">Years of Excellence</p>
          </div>
        </div>

        {/* Mini CTA / Tagline */}
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          We take pride in delivering the freshest dry fruits from Gilgit to your doorstep, ensuring quality and happiness with every order.
        </p>
      </div>
    </section>
  );
};

export default HappyClientsSection;
