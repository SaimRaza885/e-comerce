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
  <div className="full-screen-container">
  <div
    ref={trackRef}
    className="flex transition-transform duration-700 ease-in-out will-change-transform"
    style={{ transform: `translateX(-${index * 100}%)` }}
  >
    {slides.map((slide, i) => (
      <div key={i} className="slide-item">
        <img src={slide.image} alt={`slide-${i}`} className="img-cover" />
        <div className="overlay-dark"></div>
        <div className="overlay-center">
          <h2 className="hero-title">{slide.title}</h2>
          <p className="hero-subtitle">{slide.subtitle}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Dots */}
  <div className="dots-wrapper">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => setIndex(i)}
        className={`dot ${index === i ? "dot-active" : ""}`}
      />
    ))}
  </div>
</div>

  );
}
