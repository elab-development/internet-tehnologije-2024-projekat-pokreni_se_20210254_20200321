import { useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../services/authService";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = JSON.parse(localStorage.getItem("user"));
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Token might be invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      
      if (response.access_token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerUser(userData);
      
      if (response.access_token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error("Invalid registration response");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  const isRegisteredUser = useCallback(() => {
    return user?.role === "registered_user";
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin: isAdmin(),
    isRegisteredUser: isRegisteredUser(),
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
    clearError
  };
};

export default useAuth; 