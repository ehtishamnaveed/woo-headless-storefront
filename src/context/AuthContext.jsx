import React, { createContext, useContext, useState, useEffect } from "react";
import api, { siteConfigError } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siteConfigError) {
      setLoading(false);
      return;
    }
    try {
      const stored = api.getStoredUser();
      if (stored) {
        setUser(stored);
      }
    } catch (_) {
      // ignore errors from getStoredUser
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(username, password) {
    if (siteConfigError) return { success: false, error: siteConfigError };
    try {
      const result = await api.login(username, password);
      if (result.success) {
        setUser(result.data);
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message || "Login failed." };
    }
  }

  async function logout() {
    if (siteConfigError) return;
    try {
      await api.logout();
    } catch (_) {
      // ignore
    } finally {
      setUser(null);
    }
  }

  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
