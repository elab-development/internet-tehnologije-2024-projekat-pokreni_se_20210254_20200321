import EventForm from "../components/EventForm";

const CreateEvent = () => {
  return (
    <div>
      <h1>Create a New Event</h1>
      <EventForm
        editingEvent={null}
        setEditingEvent={() => {}}
        refreshEvents={() => {}}
      />
    </div>
  );
};

export default CreateEvent;
