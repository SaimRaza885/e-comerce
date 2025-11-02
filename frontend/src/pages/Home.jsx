import { slides } from "../assets/data";
import Image_Slider from "../components/Image_Silder";
import React, { Suspense, lazy } from "react";

// Lazy load dummy sections
const AboutSection = lazy(() => import("../sections/About"));
const HappyClientsSection = lazy(() => import("../sections/Clients"));
const ContactPage = lazy(() => import("../sections/Contact"));
const FAQSection = lazy(() => import("../sections/Faq"));

// ProductSection loads normally (important: real data)
import ProductSection from "../sections/Product";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

const Home = () => {
  return (
    <div>

      {/* Hero slider */}
      <Image_Slider slides={slides} />
      {/* ProductSection loads immediately and fetches from backend */}
      <ProductSection />

      {/* Other sections load lazily */}
      <FloatingWhatsApp phone="923001234567" message={encodeURIComponent("Hi! I want to order")} />
      <Suspense fallback={<div>Loading About Section...</div>}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<div>Loading Happy Clients...</div>}>
        <HappyClientsSection />
      </Suspense>

      <Suspense fallback={<div>Loading FAQ...</div>}>
        <FAQSection />
      </Suspense>

      <Suspense fallback={<div>Loading Contact Page...</div>}>
        <ContactPage />
      </Suspense>
    </div>
  );
};

export default Home;
