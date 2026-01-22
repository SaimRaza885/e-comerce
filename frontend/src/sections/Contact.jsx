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
    <section id="contact" className="py-24 bg-cream/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Get In Touch</span>
          <h2 className="heading-lg text-primary mb-4">Let's Start a <span className="text-secondary italic">Conversation</span></h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Contact Form */}
          <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/50">
            <h3 className="text-2xl font-bold text-primary mb-8">Send a Message</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <FiUser size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium text-primary placeholder:text-gray-400"
                />
              </div>

              {/* Email */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium text-primary placeholder:text-gray-400"
                />
              </div>

              {/* Message */}
              <div className="group relative">
                <div className="absolute top-4 left-4 pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <FiMessageCircle size={20} />
                </div>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white/50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium text-primary placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-4 text-lg shadow-xl shadow-primary/10"
                >
                  {loading ? "Delivering..." : "Send Message"}
                </button>
              </div>

              {/* Status Message */}
              {status && (
                <div className={`mt-4 p-4 rounded-2xl text-center font-bold text-sm ${status.includes("successfully") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                  {status}
                </div>
              )}
            </form>
          </div>

          {/* Map & Info */}
          <div className="flex flex-col gap-8">
            <div className="flex-grow min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
              <iframe
                title="Gilgit Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27423.424385123896!2d74.311927!3d35.920547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38c108f7e63b4cb1%3A0x4fda9f8eb37863ef!2sGilgit%2C%20Gilgit-Baltistan!5e0!3m2!1sen!2s!4v1692123123456!5m2!1sen!2s"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                className="border-0 grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <FiMail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                  <p className="text-sm font-bold text-primary">order@gilgit.com</p>
                </div>
              </div>
              <div className="glass p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <FiMessageCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                  <p className="text-sm font-bold text-primary">+92 345 6789012</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
