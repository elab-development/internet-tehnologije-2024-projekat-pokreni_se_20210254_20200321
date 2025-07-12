import api from "./axiosConfig";

export const fetchEvents = async (page = 1) => {
  try {
    const response = await api.get(`/events?page=${page}`);
    const events = response.data.data || [];
    return {
      events: events.map(event => ({
        ...event,
        image: event.image || "/default-event.jpg"
      })),
      pagination: {
        current_page: response.data.meta?.current_page || 1,
        last_page: response.data.meta?.last_page || 1,
        total: response.data.meta?.total || 0,
        per_page: response.data.meta?.per_page || 10,
      }
    };
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    return { events: [], pagination: { current_page: 1, last_page: 1, total: 0, per_page: 10 } };
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const formData = new FormData();
  formData.append("name", eventData.name);
  formData.append("description", eventData.description);
  formData.append("sport_id", eventData.sport_id);
  formData.append("location", eventData.location);
  formData.append("max_participants", eventData.max_participants);
  formData.append("start_time", eventData.start_time);
  if (eventData.image) {
    formData.append("image", eventData.image);
  }

  await api.post(`/events`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateEvent = async (id, eventData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", eventData.name || "");
  formData.append("description", eventData.description || "");
  formData.append("sport_id", eventData.sport_id || "");
  formData.append("location", eventData.location || "");
  formData.append("max_participants", eventData.max_participants || "");
  formData.append("start_time", eventData.start_time || "");
  if (eventData.image) {
    formData.append("image", eventData.image);
  }

  await api.post(`/events/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};

export const joinEvent = async (eventId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  await api.post(`/events/${eventId}/participants`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Update joinedEvents in localStorage
  let joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
  if (!joinedEvents.includes(eventId)) {
    joinedEvents.push(eventId);
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }
};

export const leaveEvent = async (eventId) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) throw new Error("User not logged in");

  await api.delete(`/events/${eventId}/participants/${user.id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Update joinedEvents in localStorage
  let joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
  joinedEvents = joinedEvents.filter(id => id !== eventId);
  localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
};

export const getEventParticipants = async () => {
  const response = await api.get(`/events/participants`);
  return response.data;
};

// Fetch participants for a specific event
export const fetchEventParticipants = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/participants`);
    return response.data.participants || [];
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
};

export const fetchJoinedEvents = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");
  const response = await api.get('/my-joined-events', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data || [];
};

export const fetchCreatedEvents = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");
  const response = await api.get('/my-created-events', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data || [];
};
