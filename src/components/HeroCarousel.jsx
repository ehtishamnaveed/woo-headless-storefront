import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ products = [] }) {
  const slides = products.slice(0, 6);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) =>
      prev === 0 ? Math.max(slides.length - 1, 0) : prev - 1
    );
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [next, paused, slides.length]);

  // No products — placeholder
  if (slides.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/6" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">
              New Collection
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Welcome to Our Store
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-lg mx-auto">
              Discover our curated collection of premium products.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-100 transition-colors text-base shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: "16/6" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((product, idx) => {
          const image = product.images?.[0]?.src || null;
          const category = product.categories?.[0]?.name || null;
          return (
            <div
              key={product.id}
              className="relative flex-shrink-0 w-full h-full flex"
              aria-hidden={idx !== current}
            >
              {/* Background image (right half) */}
              {image && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              )}
              {!image && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700" />
              )}

              {/* Gradient overlay — left-heavy */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center px-8 sm:px-16 w-full max-w-xl">
                {category && (
                  <span className="inline-block self-start bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                    {category}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 line-clamp-3">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mb-6">
                  {product.on_sale && product.sale_price ? (
                    <>
                      <span className="text-2xl font-bold text-white">
                        {product.sale_price}
                      </span>
                      <span className="text-base text-slate-400 line-through">
                        {product.regular_price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {product.price}
                    </span>
                  )}
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="self-start bg-white text-slate-900 font-bold py-3 px-7 rounded-full hover:bg-slate-100 transition-colors text-sm shadow-md"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev Arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors flex items-center justify-center text-white"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors flex items-center justify-center text-white"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-white w-5 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
