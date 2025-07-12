import { Link } from "react-router-dom";
import "../styles.css";

const EventCard = ({ event }) => {
  const isFull = event.participants_count !== undefined && event.max_participants !== undefined && event.participants_count >= event.max_participants;
  return (
    <div className="card">
      {isFull && (
        <div style={{color: 'red', fontWeight: 700, marginBottom: 8, fontSize: 18}}>FULL</div>
      )}
      <h3>{event.name}</h3>
      <p><strong>🏅 Sport:</strong> {event.sport?.name || 'Unknown Sport'}</p>
      <p><strong>📍 Location:</strong> {event.location}</p>
      <p><strong>👥 Participants:</strong> {event.participants_count ?? 0} / {event.max_participants}</p>
      <p><strong>📆 Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
      <Link to={`/event/${event.id}`} className="btn">View Details</Link>
    </div>
  );
};

export default EventCard;