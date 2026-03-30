import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    loading,
    toggleCart,
    updateItem,
    removeItem,
    checkout,
  } = useCart();

  const itemCount = cart.total_items ?? cart.cart_items.length;

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={toggleCart}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Your Cart{" "}
            <span className="text-slate-400 font-normal text-base">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Close cart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
          )}

          {/* Empty State */}
          {!loading && cart.cart_items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                <svg
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-700 font-semibold text-base mb-1">
                Your cart is empty
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Add some items to get started
              </p>
              <Link
                to="/shop"
                onClick={toggleCart}
                className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}

          {/* Items List */}
          {!loading && cart.cart_items.length > 0 && (
            <ul className="space-y-4">
              {cart.cart_items.map((item) => (
                <li
                  key={item.item_key}
                  className="flex gap-4 py-3 border-b border-slate-100 last:border-0"
                >
                  {/* Image */}
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image?.src ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate leading-snug">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.price}</p>

                    {/* Quantity controls — pill style */}
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={() =>
                          updateItem(item.item_key, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-7 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem(item.item_key, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-base leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.item_key)}
                    className="self-start p-1 text-slate-300 hover:text-red-500 transition-colors mt-0.5"
                    aria-label="Remove item"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.cart_items.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 bg-white space-y-3">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-700 font-medium">
                {cart.currency_symbol}
                {cart.total_amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-base">Total</span>
              <span className="font-bold text-slate-900 text-lg">
                {cart.currency_symbol}
                {cart.total_amount}
              </span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm tracking-wide mt-1"
            >
              Checkout on Store →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
