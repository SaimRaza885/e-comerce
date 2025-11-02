import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

/**
 * FloatingWhatsApp
 *
 * Props:
 * - phone (string) : phone number in international format (no plus). Default: "923001234567"
 * - message (string): url encoded default message. Example: "Hi%20I%20want%20to%20order"
 * - bottom (number|string): distance from bottom (Tailwind friendly e.g. "8" = 2rem). Default "6"
 * - right (number|string): distance from right. Default "6"
 */
const FloatingWhatsApp = ({
  phone = "923001234567",
  message = "Hi!%20I%20want%20to%20order",
  bottom = "6",
  right = "6",
}) => {
  const [yOffset, setYOffset] = useState(0);
  const lastScroll = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // Lightweight scroll -> small translate effect. Using requestAnimationFrame to avoid jank
    const onScroll = () => {
      if (rafRef.current) return; // already scheduled
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        // create a gentle parallax: small negative translate as user scrolls down
        // clamp to 30px max
        const newOffset = Math.max(-30, Math.min(30, Math.round((scrollY - lastScroll.current) * 0.15)));
        // smooth the offset by averaging with previous
        setYOffset((prev) => Math.round(prev * 0.7 + newOffset * 0.3));
        lastScroll.current = scrollY;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const waHref = `https://wa.me/${phone}?text=${message}`;

  return (
    <>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        // Tailwind classes: fixed position, responsive spacing, rounded full, shadow, ring for glow
        className={`
          fixed
          z-50
          right-${right}
          bottom-${bottom}
          md:right-8 md:bottom-8
          transform
          translate-y-0
          `}
        // inline style for transform using our small yOffset and smooth transition
        style={{
          transform: `translateY(${yOffset}px)`,
          transition: "transform 180ms cubic-bezier(.2,.9,.2,1)",
        }}
      >
        <div
          // Outer wrapper for glow + hover effects
          className={`
            flex items-center justify-center
            w-14 h-14 md:w-16 md:h-16
            rounded-full
            bg-gradient-to-br from-emerald-500 to-green-600
            text-white
            shadow-2xl
            relative
            `}
        >
          {/* Glowing ring using pseudo visually via extra div */}
          <span
            className="absolute inset-0 rounded-full opacity-70 blur-2xl animate-pulse"
            style={{
              boxShadow: "0 8px 30px rgba(16,185,129,0.35)",
              filter: "blur(6px)",
            }}
          />
          {/* Inner clickable content */}
          <span
            className="relative z-10 flex items-center justify-center w-full h-full"
            style={{
              transition: "transform 150ms ease",
            }}
          >
            <FaWhatsapp size={20} />
          </span>
        </div>

        {/* small hover area + scale effect via tailwind + inline style */}
        <style>{`
          a:hover > div {
            transform: translateY(-4px) scale(1.06);
            transition: transform 180ms cubic-bezier(.2,.9,.2,1);
          }
          @media (max-width: 640px) {
            /* for very small screens reduce size */
            a > div { width: 56px; height: 56px; }
          }
        `}</style>
      </a>
    </>
  );
};

export default FloatingWhatsApp;
