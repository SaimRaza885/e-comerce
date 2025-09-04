import { useState, useRef } from "react";

const ProductImages = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]?.url || "/images/placeholder.png");
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imgRef = useRef();

  const lensSize = 150;
  const zoom = 2;

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLensPos({
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
    });
  };

  return (
    <div className="md:w-1/2">
      {/* Main Image Container */}
      <div
        className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imgRef}
          src={mainImage}
          alt="Product"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => (e.target.src = "/images/placeholder.png")}
          loading="lazy"
        />

        {/* Zoom Lens */}
        {isHovering && (
          <div
            className="absolute border border-gray-300 rounded-full pointer-events-none overflow-hidden"
            style={{
              width: lensSize,
              height: lensSize,
              top: lensPos.y - lensSize / 2,
              left: lensPos.x - lensSize / 2,
              backgroundImage: `url(${mainImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${imgRef.current.width * zoom}px ${imgRef.current.height * zoom}px`,
              backgroundPositionX: `-${lensPos.x * zoom - lensSize / 2}px`,
              backgroundPositionY: `-${lensPos.y * zoom - lensSize / 2}px`,
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
              mainImage === img.url ? "border-yellow-500" : "border-gray-200"
            }`}
            onClick={() => setMainImage(img.url)}
          >
            <img
              src={img.url}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/images/placeholder.png")}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
