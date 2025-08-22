import { Link } from "react-router-dom";
import Button from "./Button";
import "../styles.css";

const EventCard = ({ event }) => {
  const isFull = event.participants_count !== undefined && event.max_participants !== undefined && event.participants_count >= event.max_participants;
  const isPastEvent = new Date(event.start_time) < new Date();
  
  return (
    <div className="card">
      {isPastEvent && (
        <div style={{color: '#ff6b35', fontWeight: 700, marginBottom: 8, fontSize: 18}}>PAST EVENT</div>
      )}
      {!isPastEvent && isFull && (
        <div style={{color: 'red', fontWeight: 700, marginBottom: 8, fontSize: 18}}>FULL</div>
      )}
      <h3>{event.name}</h3>
      <p><strong>🏅 Sport:</strong> {event.sport?.name || 'Unknown Sport'}</p>
      <p><strong>📍 Location:</strong> {event.location}</p>
      <p><strong>👥 Participants:</strong> {event.participants_count ?? 0} / {event.max_participants}</p>
      <p><strong>📆 Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
      <Button as={Link} to={`/event/${event.id}`} variant="outline" fullWidth>
        View Details
      </Button>
    </div>
  );
};

export default EventCard;