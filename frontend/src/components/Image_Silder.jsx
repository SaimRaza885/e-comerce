import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Image_Slider({ slides }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  // ✅ autoplay runs only once
  useEffect(() => {
    if (!instanceRef.current) return;

    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, i) => (
          <div className="keen-slider__slide relative" key={i}>
            <img
              src={slide.image}
              alt={`slide-${i}`}
              className="w-full h-screen object-cover"
              loading="lazy" // ✅ performance boost for large images
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
    </div>
  );
}
