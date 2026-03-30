import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login", { replace: true });
    return null;
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const avatarLetter =
    user?.display_name?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {avatarLetter}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {user?.display_name || user?.username}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">@{user?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
