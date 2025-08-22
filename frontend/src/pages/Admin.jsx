import React, { useState, useEffect } from "react";
import { getDashboardStats, getUsers, deleteUser, deleteSport } from "../services/adminService";
import { fetchEvents, deleteEvent } from "../services/eventService";
import { fetchSports, createSport } from "../services/sportService";
import "../styles.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSportName, setNewSportName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, eventsData, sportsData] = await Promise.all([
        getDashboardStats(),
        getUsers(),
        fetchEvents(),
        fetchSports()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setEvents(eventsData.events); // Extract the events array from the response
      setSports(sportsData);
    } catch (err) {
      setError("Failed to load admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        setStats(prev => ({ ...prev, total_users: prev.total_users - 1 }));
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
        setStats(prev => ({ ...prev, total_events: prev.total_events - 1 }));
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  const handleDeleteSport = async (sportId) => {
    if (window.confirm("Are you sure you want to delete this sport? This will also delete all events associated with this sport.")) {
      try {
        await deleteSport(sportId);
        setSports(sports.filter(sport => sport.id !== sportId));
        setStats(prev => ({ ...prev, total_sports: prev.total_sports - 1 }));
      } catch (err) {
        setError("Failed to delete sport");
      }
    }
  };

  const handleCreateSport = async (e) => {
    e.preventDefault();
    if (!newSportName.trim()) return;
    
    try {
      await createSport({ name: newSportName });
      setNewSportName("");
      const updatedSports = await fetchSports();
      setSports(updatedSports);
      setStats(prev => ({ ...prev, total_sports: prev.total_sports + 1 }));
    } catch (err) {
      setError("Failed to create sport: " + err.message);
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'registered_user': return 'Registered User';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🔧 Admin Panel</h1>
      {error && <div className="error">{error}</div>}

      {/* Tab Navigation */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        <button 
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          🎯 Events
        </button>
        <button 
          className={`tab-btn ${activeTab === "sports" ? "active" : ""}`}
          onClick={() => setActiveTab("sports")}
        >
          ⚽ Sports
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && stats && (
        <div className="admin-dashboard">
          <h2>📊 Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <p>{stats.total_users}</p>
            </div>
            <div className="stat-card">
              <h3>📝 Registered Users</h3>
              <p>{stats.total_registered_users}</p>
            </div>
            <div className="stat-card">
              <h3>🔧 Admins</h3>
              <p>{stats.total_admins}</p>
            </div>
            <div className="stat-card">
              <h3>🎯 Total Events</h3>
              <p>{stats.total_events}</p>
            </div>
            <div className="stat-card">
              <h3>⚽ Total Sports</h3>
              <p>{stats.total_sports}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="admin-users">
          <h2>👥 User Management</h2>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>📧 {user.email}</p>
                  <p>👤 {getRoleDisplay(user.role)}</p>
                  <p>📅 Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                  className="btn delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.role === 'admin'}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="admin-events">
          <h2>🎯 Event Management</h2>
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-info">
                  <h4>{event.name}</h4>
                  <p>🏅 {event.sport?.name || 'Unknown Sport'}</p>
                  <p>📍 {event.location}</p>
                  <p>📅 {new Date(event.start_time).toLocaleDateString()}</p>
                  <p>👤 Organizer: {event.organizer?.name || 'Unknown'}</p>
                </div>
                <button 
                  className="btn delete-btn"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sports Tab */}
      {activeTab === "sports" && (
        <div className="admin-sports">
          <h2>⚽ Sports Management</h2>
          
          {/* Create New Sport */}
          <div className="create-sport-form">
            <h3>Add New Sport</h3>
            <form onSubmit={handleCreateSport}>
              <input
                type="text"
                placeholder="Sport name"
                value={newSportName}
                onChange={(e) => setNewSportName(e.target.value)}
                required
              />
              <button type="submit" className="btn">➕ Add Sport</button>
            </form>
          </div>

          {/* Sports List */}
          <div className="sports-list">
            <h3>Current Sports</h3>
            {sports.map(sport => (
              <div key={sport.id} className="sport-card">
                <div className="sport-info">
                  <h4>{sport.name}</h4>
                  <p>ID: {sport.id}</p>
                </div>
                <button 
                  className="btn delete-btn"
                  onClick={() => handleDeleteSport(sport.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;