import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, joinEvent } from "../services/eventService";
import "../styles.css";
import Breadcrumbs from "../components/Breadcrumbs";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetchEventById(id).then(data => {
      setEvent(data);
      setLoading(false);
    });

    // Check if user already joined
    const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
    if (joinedEvents.includes(id)) {
      setJoined(true);
    }
  }, [id]);

  const handleJoinEvent = () => {
    joinEvent(id);
    setJoined(true);
    alert("✅ Successfully joined the event!");
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }
  if (!event) return <p className="error">Event not found!</p>;

  return (
    <div className="event-details page">
      <div className="event-header">
        <img src={event.image || "/default-event.jpg"} alt={event.name} className="event-image" />
        <Breadcrumbs /> {/* ✅ Breadcrumbs added */}
        <h1>{event.name}</h1>
      </div>
      <div className="event-info">
        <p><strong>🏅 Sport:</strong> {event.sport}</p>
        <p><strong>📍 Location:</strong> {event.location}</p>
        <p><strong>📆 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>📖 Description:</strong> {event.description}</p>
      </div>
      {/* Join Event Button */}
      <button className={'btn ${joined ? "joined-btn" : ""}'} onClick={handleJoinEvent} disabled={joined}>
        {joined ? "✅ Joined" : "Join Event"}
      </button>
    </div>
  );
};

export default EventDetails;