import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const fetchEvents = async () => {
  try {
    const response = await axios.get('${API_URL}/events');
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
    const response = await fetch('http://localhost:5000/api/events/${id}');
    return await response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};


// Store the event ID in local storage when user joins



export const createEvent = async (eventData) => {
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  if (!user) throw new Error("User not logged in");

  await axios.post('${API_URL}/events, { ...eventData, userId: user.id }');
};

export const updateEvent = async (id, eventData) => {
  await axios.put('${API_URL}/events/${id}, eventData');
};

export const deleteEvent = async (id) => {
  await axios.delete('${API_URL}/events/${id}');
};

export const joinEvent = async (eventId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  await axios.post('${API_URL}/events/${eventId}/join, { userId: user.id }');
};

// Leave an event
export const leaveEvent = (id) => {
  let joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
  joinedEvents = joinedEvents.filter(eventId => eventId !== id);
  localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
};
// Get participants for all events
export const getEventParticipants = async () => {
  const response = await axios.get('${API_URL}/events/participants');
  return response.data;
};