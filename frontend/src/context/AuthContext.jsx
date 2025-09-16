import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on mount, try to fetch current user (cookie-based)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (err) {
        if (err.response?.status !== 401) {
        console.error("Error fetching current user:", err);
      }
      setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    setUser(data);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await apiSignup({ name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
