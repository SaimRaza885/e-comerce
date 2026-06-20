import { useState } from "react";

const ProductImages = ({ images }) => {
  const [mainImage, setMainImage] = useState(images?.[0]?.url || "");

  if (!images?.length) {
    return (
      <div className="aspect-square bg-cream rounded-2xl flex items-center justify-center">
        <span className="text-secondary text-sm font-bold">No image</span>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square bg-cream/30 rounded-2xl overflow-hidden mb-4">
        <img
          src={mainImage}
          alt="Product"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img.url)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                mainImage === img.url ? "border-accent shadow-md" : "border-gray-100 hover:border-secondary"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
