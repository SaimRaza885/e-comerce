import React from "react";

const Small_Banner = ({ title, subtitle, bgImage }) => {
  return (
    <div
      className="w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center relative bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      <div className="relative z-10 text-center text-white px-4 pt-20">
        <h1 className="heading-xl mb-3 drop-shadow-lg">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-white/80 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Small_Banner;
