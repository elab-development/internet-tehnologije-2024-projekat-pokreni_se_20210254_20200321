import { useEffect, useState } from "react";
import { fetchEventById, leaveEvent } from "../services/eventService";
import "../styles.css";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents")) || [];
    const fetchJoinedEvents = async () => {
      const eventsData = await Promise.all(joinedEvents.map(id => fetchEventById(id)));
      setMyEvents(eventsData.filter(event => event !== null));
    };
    fetchJoinedEvents();
  }, []);

  const handleLeaveEvent = (id) => {
    leaveEvent(id);
    setMyEvents(myEvents.filter(event => event.id !== id)); // Remove from state
  };

  return (
    <div className="container">
      <h1>📋 My Events</h1>
      <div className="event-grid">
        {myEvents.length > 0 ? (
          myEvents.map(event => (
            <div key={event.id} className="card">
              <h3>{event.name}</h3>
              <p><strong>🏅 Sport:</strong> {event.sport}</p>
              <p><strong>📍 Location:</strong> {event.location}</p>
              <p><strong>📆 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <button className="btn leave-btn" onClick={() => handleLeaveEvent(event.id)}>❌ Leave Event</button>
            </div>
          ))
        ) : (
          <p>You haven't joined any events yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;