import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../services/eventService";

const EventForm = ({ editingEvent, setEditingEvent, refreshEvents }) => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    sport: ""
  });

  useEffect(() => {
    if (editingEvent) {
      setEventData(editingEvent);
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEvent) {
      await updateEvent(editingEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
    setEditingEvent(null);
    refreshEvents(); // Refresh the event list
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <input type="text" name="name" value={eventData.name} placeholder="Event Name" onChange={handleChange} required />
      <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
      <input type="text" name="location" value={eventData.location} placeholder="Location" onChange={handleChange} required />
      <input type="text" name="sport" value={eventData.sport} placeholder="Sport" onChange={handleChange} required />
      <button type="submit">{editingEvent ? "Update Event" : "Create Event"}</button>
    </form>
  );
};

export default EventForm;