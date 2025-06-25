import { deleteEvent, joinEvent, leaveEvent, getEventParticipants } from "../services/eventService";
import { getUserRole } from "../services/authService";
import { useState, useEffect } from "react";

const EventList = ({ events, setEditingEvent }) => {
  const role = getUserRole();
  const user = JSON.parse(localStorage.getItem("user"));
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    const loadParticipants = async () => {
      const allParticipants = await getEventParticipants();
      setParticipants(allParticipants);
    };
    loadParticipants();
  }, [events]);

  return (
    <div className="event-list">
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.name}</h3>
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          
          {/* Edit & Delete Buttons */}
          {role === "admin" || (role === "registered_user" && event.userId === user?.id) ? (
            <>
              <button onClick={() => setEditingEvent(event)}>✏ Edit</button>
              <button onClick={() => deleteEvent(event.id)}>🗑 Delete</button>
            </>
          ) : null}

          {/* Join / Leave Event */}
          {user && (
            participants[event.id]?.includes(user.id) ? (
              <button onClick={() => leaveEvent(event.id)}>🚪 Leave Event</button>
            ) : (
              <button onClick={() => joinEvent(event.id)}>✅ Join Event</button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;