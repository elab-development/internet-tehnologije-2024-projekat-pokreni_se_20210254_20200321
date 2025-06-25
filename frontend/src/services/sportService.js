import axios from "axios";
const API_URL = "http://localhost:8000/api";

// Create a sport (Admins Only)
export const createSport = async (sportData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role !== "admin") throw new Error("Not authorized");

  await axios.post('${API_URL}/sports, sportData');
};