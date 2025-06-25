import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data.map(event => ({
      ...event,
      image: event.image || "/default-event.jpg"
    }));
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    return [];
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const createEvent = async (eventData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not logged in");

  const formData = new FormData();
  formData.append("name", eventData.name);
  formData.append("description", eventData.description);
  formData.append("sport_id", eventData.sport_id);
  formData.append("location", eventData.location);
  formData.append("max_participants", eventData.max_participants);
  formData.append("start_time", eventData.start_time);
  formData.append("image", eventData.image); // optional

  await axios.post("http://localhost:8000/api/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};


export const updateEvent = async (id, eventData) => {
  await axios.put(`${API_URL}/events/${id}`, eventData);
};

export const deleteEvent = async (id) => {
  await axios.delete(`${API_URL}/events/${id}`);
};

export const joinEvent = async (eventId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not logged in");

  await axios.post(`${API_URL}/events/${eventId}/join`, { userId: user.id });
};

export const leaveEvent = (id) => {
  let joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
  joinedEvents = joinedEvents.filter(eventId => eventId !== id);
  localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
};

export const getEventParticipants = async () => {
  const response = await axios.get(`${API_URL}/events/participants`);
  return response.data;
};
