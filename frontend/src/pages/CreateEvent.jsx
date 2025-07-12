import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleEventCreated = () => {
    navigate("/"); // Redirect to home page after successful creation
  };

  return (
    <div className="container">
      <h1>🏆 Create a New Event</h1>
      <EventForm
        editingEvent={null}
        setEditingEvent={() => {}}
        refreshEvents={handleEventCreated}
      />
    </div>
  );
};

export default CreateEvent;
