import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust the URL to match your backend

// Function to login user
export const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/login", { // Change API URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || "Login failed");
    
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || "Registration failed");

    return data;
  } catch (error) {
    throw error.message;
  }
};

// Function to get the current user
export const getCurrentUser = () => {
  return localStorage.getItem("token"); // Retrieve stored token
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role || "guest"; // Default to "guest" if no role found
};