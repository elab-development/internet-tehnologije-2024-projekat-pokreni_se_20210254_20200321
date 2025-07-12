import api from "./axiosConfig";

// Fetch all sports
export const fetchSports = async () => {
  try {
    const response = await api.get('/sports');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching sports:", error.response?.data || error.message);
    return [];
  }
};

// Create a sport (Admins Only)
export const createSport = async (sportData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role !== "admin") throw new Error("Not authorized");

  await api.post('/sports', sportData);
};