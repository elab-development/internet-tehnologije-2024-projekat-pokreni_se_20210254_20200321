import { Link } from "react-router-dom";
import "../styles.css";

const EventCard = ({ event }) => {
  return (
    <div className="card">
      <h3>{event.name}</h3>
      <p><strong>🏅 Sport:</strong> {event.sport}</p>
      <p><strong>📍 Location:</strong> {event.location}</p>
      <p><strong>📆 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <Link to={'/event/${event.id}'} className="btn">View Details</Link>
    </div>
  );
};

export default EventCard;