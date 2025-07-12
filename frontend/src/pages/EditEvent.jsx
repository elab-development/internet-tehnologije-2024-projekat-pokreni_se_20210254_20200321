import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateEvent } from "../services/eventService";
import { fetchSports } from "../services/sportService";
import "../styles.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const [eventData, sportsData] = await Promise.all([
        fetchEventById(id),
        fetchSports()
      ]);
      
      if (eventData?.data) {
        const loadedEvent = { ...eventData.data };
        if (!loadedEvent.sport_id && loadedEvent.sport) {
          loadedEvent.sport_id = loadedEvent.sport.id;
        }
        setEvent(loadedEvent);
      }
      setSports(sportsData);
    } catch (err) {
      setError("Failed to load event data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    try {
      setSaving(true);
      setError("");
      
      await updateEvent(id, event);
      navigate("/my-events");
    } catch (err) {
      setError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEvent({ ...event, [name]: files[0] });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <p className="error">Event not found!</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>✏️ Edit Event</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Event Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={event.name || ""}
          placeholder="Event Name"
          onChange={handleChange}
          required
        />
        
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={event.description || ""}
          placeholder="Event Description"
          onChange={handleChange}
          required
          rows="4"
        />
        
        <label htmlFor="sport_id">Sport</label>
        <select
          id="sport_id"
          name="sport_id"
          value={event.sport_id || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select a Sport</option>
          {sports.map(sport => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={event.location || ""}
          placeholder="Location"
          onChange={handleChange}
          required
        />
        
        <label htmlFor="max_participants">Max Participants</label>
        <input
          type="number"
          id="max_participants"
          name="max_participants"
          value={event.max_participants || ""}
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
          value={event.start_time ? event.start_time.slice(0, 16) : ""}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="image">Event Image (Optional)</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving..." : "Update Event"}
          </button>
          <button 
            type="button" 
            className="btn secondary" 
            onClick={() => navigate("/my-events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent; 