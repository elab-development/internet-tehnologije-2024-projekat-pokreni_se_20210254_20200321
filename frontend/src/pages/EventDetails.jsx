import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, joinEvent, leaveEvent, fetchEventParticipants } from "../services/eventService";
import "../styles.css";
import Breadcrumbs from "../components/Breadcrumbs";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  // Get current user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setLoading(true);
    fetchEventById(id).then(response => {
      setEvent(response?.data);
      setLoading(false);
    });
    fetchEventParticipants(id).then(setParticipants);
  }, [id]);

  // Check if user is a participant
  const isJoined = user && participants.some(p => (p.id || p.user_id) === user.id);
  const isFull = event && participants.length >= event.max_participants;

  const handleJoinEvent = async () => {
    setJoining(true);
    setError("");
    try {
      await joinEvent(id);
      fetchEventParticipants(id).then(setParticipants);
    } catch (err) {
      setError(err.message || "Failed to join event.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    setJoining(true);
    setError("");
    try {
      await leaveEvent(id);
      fetchEventParticipants(id).then(setParticipants);
    } catch (err) {
      setError(err.message || "Failed to leave event.");
    } finally {
      setJoining(false);
    }
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
    <div className="event-details page" style={{ maxWidth: 600, margin: "40px auto", background: "#1b263b", borderRadius: 16, boxShadow: "0 6px 24px rgba(0,0,0,0.18)", padding: 32 }}>
      <div className="event-header" style={{ textAlign: "center" }}>
        <img src={event.image || "/default-event.jpg"} alt={event.name} className="event-image" style={{ maxHeight: 260, objectFit: "cover", borderRadius: 12, marginBottom: 18 }} />
        <Breadcrumbs />
        <h1 style={{ color: "#f4a261", margin: "18px 0 8px 0" }}>{event.name}</h1>
      </div>
      <div className="event-info" style={{ marginBottom: 18 }}>
        <p><strong>🏅 Sport:</strong> {event.sport?.name || 'Unknown Sport'}</p>
        <p><strong>📍 Location:</strong> {event.location}</p>
        <p><strong>👤 Organizer:</strong> {event.organizer?.name || 'Unknown'}</p>
        <p><strong>👥 Max Participants:</strong> {event.max_participants}</p>
        <p><strong>📆 Date:</strong> {new Date(event.start_time).toLocaleString()}</p>
        <p><strong>📖 Description:</strong> {event.description}</p>
      </div>
      {error && <div className="error">{error}</div>}
      {/* Join/Leave Event Button */}
      {!isJoined ? (
        <button
          className="btn"
          onClick={handleJoinEvent}
          disabled={joining || isFull}
          style={{ width: "100%", marginBottom: 18, backgroundColor: isFull ? "#888" : undefined }}
          title={isFull ? "Event is full" : ""}
        >
          {isFull ? "Event Full" : (joining ? "Joining..." : "Join Event")}
        </button>
      ) : (
        <button className="btn leave-btn" onClick={handleLeaveEvent} style={{ width: "100%", marginBottom: 18 }}>
          ❌ Leave Event
        </button>
      )}
      {/* Participants List */}
      <div style={{ background: "#16213a", borderRadius: 10, padding: 16, marginTop: 10 }}>
        <strong>Participants ({participants.length}):</strong>
        {participants.length === 0 ? (
          <p style={{ color: "#aaa", margin: 0 }}>No participants yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {participants.map((p) => (
              <li key={p.user_id || p.id} style={{ color: "#f4a261", padding: "2px 0" }}>
                {p.user?.name || p.name || "Unknown"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventDetails;