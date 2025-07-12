import api from "./axiosConfig";

// Get admin dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Delete any event (admin only)
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Delete a sport (admin only)
export const deleteSport = async (sportId) => {
  try {
    const response = await api.delete(`/sports/${sportId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sport:", error);
    throw error;
  }
}; 