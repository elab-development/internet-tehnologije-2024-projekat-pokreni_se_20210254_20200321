import SportForm from "../components/SportForm"; // Import the form

const AdminPanel = () => {
  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <SportForm />  {/* Admins can create sports */}
      <EventList adminView={true} />
    </div>
  );
};

export default AdminPanel;