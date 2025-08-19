import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Image_Slider({ slides  }) {
  // ✅ change here
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    let timer;
    if (instanceRef.current) {
      timer = setInterval(() => {
        instanceRef.current.next();
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {slides.map(
          (
            slides,
            i // ✅ images not slides
          ) => (
            <div className="keen-slider__slide relative" key={i}>
              <img
                src={slides.image}
                alt={`slide-${i}`}
                style={{
                  width: "100%",
                  height: "100vh",
                  objectFit: "cover",
                }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slides.title}
                </h2>
                <p className="text-lg md:text-2xl max-w-2xl drop-shadow-md">
                  {slides.subtitle}
                </p>
              </div>
            </div>
          )
        )}
      </div>
      {/* arrows + dots remain same */}
    </div>
  );
}
