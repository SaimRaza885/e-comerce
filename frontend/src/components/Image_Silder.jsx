import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function ImageSlider({ slides, interval = 6000 }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Preload next image for smoother transition
  useEffect(() => {
    const nextIndex = (index + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [index, slides]);

  // Autoplay
  useEffect(() => {
    const next = () => {
      setIndex((prev) => (prev + 1) % slides.length);
    };
    timeoutRef.current = setTimeout(next, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [index, interval, slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            {/* Background Image with Parallax-like effect */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-start">
              <div className={`max-w-3xl transition-all duration-1000 delay-300 ${index === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                <span className="inline-block text-accent font-bold tracking-[0.3em] uppercase mb-4 text-sm drop-shadow-sm">
                  Premium Collection
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-cream/90 mb-10 max-w-xl leading-relaxed drop-shadow-md">
                  {slide.subtitle || "Discover the finest selection of organic dry fruits, handpicked from the lush valleys of Gilgit Baltistan."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/products/all"
                    className="btn-premium px-10 py-4 text-lg group bg-accent text-primary hover:bg-white"
                  >
                    Shop Now
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-2" />
                  </Link>
                  <a
                    href="#product"
                    className="btn-premium-outline px-10 py-4 text-lg border-white text-white hover:bg-white hover:text-primary"
                  >
                    View Catalog
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Indicators (Progress Bars) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group relative h-1 w-12 md:w-20 bg-white/20 rounded-full overflow-hidden transition-all"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`absolute top-0 left-0 h-full bg-accent transition-all duration-[6000ms] ease-linear ${index === i ? "w-full" : "w-0"}`}
            />
          </button>
        ))}
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-6 right-10 hidden lg:flex flex-col items-center gap-4 animate-bounce opacity-50">
        <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em] transform rotate-90 origin-right">Scroll</span>
        <div className="w-px h-12 bg-white/30"></div>
      </div>
    </div>
  );
}
