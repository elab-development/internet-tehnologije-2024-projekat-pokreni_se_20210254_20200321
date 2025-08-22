import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEventById, leaveEvent, fetchJoinedEvents, fetchCreatedEvents, deleteEvent } from "../services/eventService";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import "../styles.css";

const MyEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("joined");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      // Fetch joined events from backend
      const joinedEventsData = await fetchJoinedEvents();
      setJoinedEvents(joinedEventsData);
      // Fetch created events from backend
      const createdEventsData = await fetchCreatedEvents();
      setCreatedEvents(createdEventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveEvent = async (id) => {
    await leaveEvent(id);
    setJoinedEvents(joinedEvents.filter(event => event.id !== id));
  };

  const handleEditEvent = (event) => {
    navigate(`/edit-event/${event.id}`);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id); // Actually delete from backend
        setCreatedEvents(createdEvents.filter(event => event.id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner message="Loading your events..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>📋 My Events</h1>
      {/* Tab Navigation */}
      <div className="my-events-tabs" style={{ marginBottom: 20 }}>
        <button 
          className={`tab-btn ${activeTab === "joined" ? "active" : ""}`}
          onClick={() => setActiveTab("joined")}
        >
          🎯 Joined Events ({joinedEvents.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
          onClick={() => setActiveTab("created")}
        >
          ✏️ Created Events ({createdEvents.length})
        </button>
      </div>
      {/* Joined Events Tab */}
      {activeTab === "joined" && (
        <div className="joined-events">
          <h2>🎯 Events You've Joined</h2>
          <div className="event-grid">
            {joinedEvents.length > 0 ? (
              joinedEvents.map(event => (
                <div key={event.id} className="card">
                  <h3>{event.name}</h3>
                  <p><strong>🏅 Sport:</strong> {event.sport?.name || 'Unknown Sport'}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>📆 Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
                  <p><strong>👤 Organizer:</strong> {event.organizer?.name || 'Unknown'}</p>
                  <Button 
                    variant="danger" 
                    onClick={() => handleLeaveEvent(event.id)}
                    fullWidth
                  >
                    ❌ Leave Event
                  </Button>
                </div>
              ))
            ) : (
              <p>You haven't joined any events yet.</p>
            )}
          </div>
        </div>
      )}
      {/* Created Events Tab */}
      {activeTab === "created" && (
        <div className="created-events">
          <h2>✏️ Events You've Created</h2>
          <div className="event-grid">
            {createdEvents.length > 0 ? (
              createdEvents.map(event => (
                <div key={event.id} className="card">
                  <h3>{event.name}</h3>
                  <p><strong>🏅 Sport:</strong> {event.sport?.name || 'Unknown Sport'}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>📆 Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
                  <p><strong>👥 Max Participants:</strong> {event.max_participants}</p>
                  <div className="event-actions">
                    <Button 
                      variant="primary" 
                      onClick={() => handleEditEvent(event)}
                      size="small"
                    >
                      ✏️ Edit Event
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDeleteEvent(event.id)}
                      size="small"
                    >
                      🗑️ Delete Event
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>You haven't created any events yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;