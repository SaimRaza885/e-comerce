import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FiSmile, FiPackage, FiAward } from "react-icons/fi";

const HappyClientsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-24 bg-primary text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Impact</span>
          <h2 className="heading-lg mb-4">Numbers that Speak <span className="text-accent italic">Trust</span></h2>
          <div className="w-20 h-1 bg-accent/30 mx-auto rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { icon: <FiSmile />, end: 1200, label: "Happy Clients", color: "text-accent" },
            { icon: <FiPackage />, end: 3500, label: "Deliveries Done", color: "text-secondary" },
            { icon: <FiAward />, end: 5, label: "Years of Excellence", color: "text-white" },
          ].map((stat, i) => (
            <div key={i} className="glass-dark p-10 rounded-[2rem] hover-glow group transition-all duration-500">
              <div className={`text-5xl ${stat.color} mb-6 flex justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <h3 className="text-5xl font-black mb-2 tracking-tighter">
                {inView ? <CountUp end={stat.end} duration={2.5} separator="," /> : "0"}+
              </h3>
              <p className="text-cream/60 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mini CTA */}
        <div className="mt-20 text-center">
          <p className="text-cream/80 text-xl max-w-2xl mx-auto leading-relaxed italic">
            "Delivering the golden essence of Gilgit mountains to every corner of Pakistan, one premium package at a time."
          </p>
        </div>
      </div>
    </section>
  );
};

export default HappyClientsSection;
