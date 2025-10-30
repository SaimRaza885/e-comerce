import React from "react";

const PriceTag = ({ price, unit, size = "sm", isBlack = false }) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-[1.3rem]",
    lg: "text-[1.7rem]",
    xl: "text-[2rem]",
  };

  const baseClasses = `${sizeClasses[size]} my-2 font-semibold mb-1`;

  if (isBlack) {
    // Normal black text (no gradient)
    return (
      <p className={`${baseClasses} text-gray-800`}>
        Rs. {price?.toLocaleString()}
        {unit && (
          <span className="text-gray-500 text-xs font-medium"> / {unit}</span>
        )}
      </p>
    );
  }

  // Gradient text version
  return (
    <p
      className={`${baseClasses} bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent`}
    >
      Rs. {price?.toLocaleString()}
      {unit && (
        <span className="text-gray-500 text-xs font-medium"> / {unit}</span>
      )}
    </p>
  );
};

export default PriceTag;
