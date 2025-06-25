import axios from "axios";

const API_URL = "http://localhost:8000/api";

// 🔐 Register new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log("✅ Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);

    // 🔍 Log detailed validation errors
    if (error.response?.data?.errors) {
      console.table(error.response.data.errors);
    }

    throw new Error(
      error.response?.data?.message || "Registration failed. Please check your input."
    );
  }
};

// 🔐 Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    const data = response.data;

    // Store token locally (optional: store user too if returned)
    localStorage.setItem("token", data.access_token);
    return data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
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
