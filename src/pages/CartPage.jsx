import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, checkout } = useCart();

  if (loading && cart.cart_items.length === 0) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (cart.cart_items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <svg
          className="h-20 w-20 text-gray-300 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-gray-900 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Cart Items */}
            {cart.cart_items.map((item) => {
              const unitPrice = parseFloat(item.price) || 0;
              const rowTotal = (unitPrice * item.quantity).toFixed(2);

              return (
                <div
                  key={item.item_key}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center"
                >
                  {/* Product */}
                  <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.image?.src ? (
                        <img
                          src={item.image.src}
                          alt={item.image.alt || item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.item_key)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 sm:col-span-2 text-sm text-gray-600 sm:text-center">
                    {cart.currency_symbol}{unitPrice.toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateItem(item.item_key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm border-x border-gray-300 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.item_key, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Row Total */}
                  <div className="col-span-4 sm:col-span-2 text-sm font-semibold text-gray-900 sm:text-right">
                    {cart.currency_symbol}{rowTotal}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Subtotal ({cart.total_items} item{cart.total_items !== 1 ? "s" : ""})
              </span>
              <span>{cart.currency_symbol}{cart.total_amount}</span>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{cart.currency_symbol}{cart.total_amount}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={checkout}
              className="w-full mt-6 bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
