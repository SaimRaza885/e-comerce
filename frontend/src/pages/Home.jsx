import { slides } from "../assets/data";
import Image_Slider from "../components/Image_Silder";
import React, { Suspense, lazy } from "react";

// Lazy load the sections
const AboutSection = lazy(() => import("../sections/About"));
const HappyClientsSection = lazy(() => import("../sections/Clients"));
const ContactPage = lazy(() => import("../sections/Contact"));
const FAQSection = lazy(() => import("../sections/Faq"));
const ProductSection = lazy(() => import("../sections/Product"));

const Home = () => {
  return (
    <div>

      <Image_Slider slides={slides} />
      
      
      {/* Wrap lazy components in Suspense with a fallback */}
      <Suspense fallback={<div>Loading Product Section...</div>}>
        <ProductSection />
      </Suspense>
      
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
