import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const featuredImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  async function handleAddToCart(e) {
    e.stopPropagation();
    if (!product.in_stock || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, "1");
    } finally {
      setAdding(false);
    }
  }

  function handleCardClick() {
    navigate(`/product/${product.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {featuredImage ? (
          <img
            src={featuredImage.src}
            alt={featuredImage.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <svg
              className="h-14 w-14 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Sale Badge */}
        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Sale
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2 flex-grow leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.on_sale && product.sale_price ? (
            <>
              <span className="text-base font-bold text-red-600">
                {product.sale_price}
              </span>
              <span className="text-sm text-slate-400 line-through">
                {product.regular_price}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-slate-900">
              {product.price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!product.in_stock ? (
          <button
            disabled
            className="w-full py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-indigo-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Adding…
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
