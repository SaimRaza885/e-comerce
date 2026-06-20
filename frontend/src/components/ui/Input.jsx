import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-primary mb-1.5 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-primary placeholder-gray-400 transition-all outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${icon ? "pl-10" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
