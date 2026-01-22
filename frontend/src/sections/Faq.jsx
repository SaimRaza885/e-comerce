import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { faqData } from "../assets/data";



const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-cream/30" id="faq">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Assistance</span>
          <h2 className="heading-lg text-primary mb-4">Questions & <span className="text-secondary italic">Answers</span></h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl border transition-all duration-500 ${openIndex === index
                  ? "bg-white border-accent shadow-xl ring-1 ring-accent/20"
                  : "bg-white/50 border-gray-100 hover:border-accent/40"
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-8 py-6 text-left focus:outline-none group"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === index ? "text-primary" : "text-gray-700 group-hover:text-primary"
                  }`}>
                  {item.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? "bg-accent text-primary rotate-180" : "bg-cream text-secondary"
                  }`}>
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-8 pb-8 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Still have questions? <a href="#contact" className="text-secondary font-bold hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
