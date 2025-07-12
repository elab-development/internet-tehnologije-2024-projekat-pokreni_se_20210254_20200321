import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Do NOT log out or remove token automatically
      // Optionally, show a message or handle gracefully
      // alert("You are not authorized. Please log in again if this was a mistake.");
    }
    return Promise.reject(error);
  }
);

export default api; 