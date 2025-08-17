import api from "./axiosConfig";

const API_URL = "http://localhost:8000/api";

// 🔐 Register new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/register`, userData);
    console.log("✅ Registration response:", response.data);
    
    // Store token and user data immediately after successful registration
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);

    // If Laravel validation errors exist, join them into a single string
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const messages = Object.values(errors).flat().join("\n");
      throw new Error(messages);
    }

    throw new Error(
      error.response?.data?.message || "Registration failed. Please check your input."
    );
  }
};

// 🔐 Login user
export const loginUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/login`, userData);
    const data = response.data;

    // Store token and user locally
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user)); // <-- Add this line!
    return data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    // If Laravel validation errors exist, join them into a single string
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const messages = Object.values(errors).flat().join("\n");
      throw new Error(messages);
    }
    throw new Error(
      error.response?.data?.message || "Login failed. Please check your credentials."
    );
  }
};

// 🔐 Get current user token from local storage
export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

// 🔐 Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // if you're storing user object too
};

// 🔐 Get role from stored user object
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role || "guest";
};
