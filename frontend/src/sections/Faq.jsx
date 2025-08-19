import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { faqData } from "../assets/data";



const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-mint-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="sec_heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Here are some common questions about our dry fruits and services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
              >
                <span className="text-gray-800 font-medium text-lg">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <FiMinus className="text-mint-500 text-xl" />
                ) : (
                  <FiPlus className="text-mint-500 text-xl" />
                )}
              </button>

              {/* Answer */}
              <div
                className={`px-6 text-gray-600 transition-all duration-500 overflow-hidden ${
                  openIndex === index ? "max-h-96 py-4" : "max-h-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
