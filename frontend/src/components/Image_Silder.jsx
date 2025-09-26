import React, { useEffect, useRef, useState } from "react";

export default function ImageSlider({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const timeoutRef = useRef(null);

  // Preload next image for smoother transition
  useEffect(() => {
    const nextIndex = (index + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [index, slides]);

  // Autoplay with minimal re-render
  useEffect(() => {
    const next = () => {
      setIndex((prev) => (prev + 1) % slides.length);
    };
    timeoutRef.current = setTimeout(next, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [index, interval, slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full flex-shrink-0 h-screen relative">
            <img
              src={slide.image}
              alt={`slide-${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              index === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
