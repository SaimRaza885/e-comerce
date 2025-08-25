import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FiUser, FiMail, FiMessageCircle } from "react-icons/fi";
import { DotEnvConfig } from "../conf/conf";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const emailData = {
      ...formData,
      time: new Date().toLocaleString(),
    };

    emailjs
      .send(
        DotEnvConfig.serviceId,
        DotEnvConfig.templateId,
        emailData,
        DotEnvConfig.publicKey
      )
      .then(
        () => {
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          setStatus("Failed to send message. Try again later.");
          console.error(error.text);
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="sec_heading">
            Contact Us
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Send us a message and we’ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid  md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-[80%] sm:w-full flex-col  gap-6 bg-mint-50 p-8 rounded-xl shadow-lg"
          >
            {/* Name */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-mint-500">
              <FiUser className="text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 outline-none px-2 py-1"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-mint-500">
              <FiMail className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 outline-none px-2 py-1"
              />
            </div>

            {/* Message */}
            <div className="flex items-start gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-mint-500">
              <FiMessageCircle className="text-gray-500 mt-1" />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="flex-1 outline-none px-2 py-1 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/80 text-white font-medium px-6 py-3 rounded-full shadow transition w-max flex items-center gap-2 justify-center"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* Status Message */}
            {status && <p className="text-gray-700 mt-2">{status}</p>}
          </form>

          {/* Google Map */}
          <div className="w-[80%] sm:w-full h-80 md:h-full rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Gilgit Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27423.424385123896!2d74.311927!3d35.920547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38c108f7e63b4cb1%3A0x4fda9f8eb37863ef!2sGilgit%2C%20Gilgit-Baltistan!5e0!3m2!1sen!2s!4v1692123123456!5m2!1sen!2s"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
