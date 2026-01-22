import React, { useMemo } from "react";

const Small_Banner = ({ title, subtitle, bgImage  }) => {

 


  return (

   
    <div
      className="w-full min-h-[70vh] flex items-center justify-center relative bg-center bg-cover"
      style={{ backgroundImage: `url(${ bgImage })` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Text content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg ">
          {title}
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md ">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Small_Banner;
