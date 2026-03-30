import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart, toggleCart } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  }

  const avatarLetter = user?.display_name
    ? user.display_name.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Store Name */}
          <Link
            to="/"
            className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors tracking-tight"
          >
            My Store
          </Link>

          {/* Center: Nav Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/shop"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
            >
              Cart
            </Link>
          </div>

          {/* Right: Cart + Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center leading-none">
                  {cart.total_items > 99 ? "99+" : cart.total_items}
                </span>
              )}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  {avatarLetter}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {user?.display_name || user?.username}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      )}
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
