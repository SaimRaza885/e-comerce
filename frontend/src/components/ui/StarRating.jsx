import { Star } from "lucide-react";

const StarRating = ({ rating = 0, onChange, size = "sm", readonly = false }) => {
  const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
  const s = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`${s} ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
