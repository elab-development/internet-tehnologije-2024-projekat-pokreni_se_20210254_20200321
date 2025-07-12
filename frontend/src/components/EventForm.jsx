import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../services/eventService";
import { fetchSports } from "../services/sportService";
import "../styles.css";

// Helper to format datetime-local to 'YYYY-MM-DD HH:mm:ss'
function formatDateTimeLocal(dt) {
  if (!dt) return "";
  // dt is like '2025-07-09T16:00'
  const [date, time] = dt.split("T");
  return `${date} ${time}:00`;
}

const EventForm = ({ editingEvent, setEditingEvent, refreshEvents }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    sport_id: "",
    location: "",
    max_participants: "",
    start_time: "",
    image: null
  });
  const [sports, setSports] = useState([]);

  useEffect(() => {
    if (editingEvent) {
      setEventData(editingEvent);
    }
  }, [editingEvent]);

  useEffect(() => {
    const loadSports = async () => {
      const sportsData = await fetchSports();
      setSports(sportsData);
    };
    loadSports();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEventData({ ...eventData, [name]: files[0] });
    } else if (name === "sport_id") {
      setEventData({ ...eventData, [name]: String(value) });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventToSend = {
        ...eventData,
        start_time: formatDateTimeLocal(eventData.start_time),
      };
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventToSend);
      } else {
        await createEvent(eventToSend);
        // Reset form after successful creation
        setEventData({
          name: "",
          description: "",
          sport_id: "",
          location: "",
          max_participants: "",
          start_time: "",
          image: null
        });
      }
      setEditingEvent(null);
      refreshEvents(); // Refresh the event list or navigate
    } catch (error) {
      console.error("Error creating/updating event:", error);
      alert("Error creating event. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{editingEvent ? "Edit Event" : "Create Event"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Event Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={eventData.name}
          placeholder="Event Name"
          onChange={handleChange}
          required
        />
        
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          placeholder="Event Description"
          onChange={handleChange}
          required
          rows="4"
        />
        
        <label htmlFor="sport_id">Sport</label>
        <select
          id="sport_id"
          name="sport_id"
          value={eventData.sport_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a Sport</option>
          {sports.map(sport => (
            <option key={sport.id} value={String(sport.id)}>
              {sport.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={eventData.location}
          placeholder="Location"
          onChange={handleChange}
          required
        />
        
        <label htmlFor="max_participants">Max Participants</label>
        <input
          type="number"
          id="max_participants"
          name="max_participants"
          value={eventData.max_participants}
          placeholder="Maximum number of participants"
          onChange={handleChange}
          min="1"
          required
        />
        
        <label htmlFor="start_time">Start Time</label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={eventData.start_time}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="image">Event Image (Optional)</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
        
        <button type="submit" className="btn" style={{ width: "100%", marginTop: "15px" }}>
          {editingEvent ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;