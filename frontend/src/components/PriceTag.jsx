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

  // Premium text version
  return (
    <p
      className={`${baseClasses} text-primary flex items-baseline gap-1`}
    >
      <span className="text-sm font-medium opacity-70">Rs.</span>
      <span className="text-2xl font-extrabold">{price?.toLocaleString()}</span>
      {unit && (
        <span className="text-secondary text-xs font-bold uppercase tracking-wider ml-1">/{unit}</span>
      )}
    </p>
  );
};

export default PriceTag;
