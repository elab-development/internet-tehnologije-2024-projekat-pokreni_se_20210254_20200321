import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="container">
        <h2>Not logged in</h2>
        <p>Please log in to view your profile information.</p>
      </div>
    );
  }

  // Convert role to user-friendly display
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'registered_user':
        return 'Registered User';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "40px auto", background: "#1b263b", borderRadius: 16, boxShadow: "0 6px 24px rgba(0,0,0,0.18)", padding: 32 }}>
      <h1 style={{ color: "#f4a261", marginBottom: 18 }}>👤 Profile</h1>
      <div style={{ background: "#16213a", borderRadius: 10, padding: 16 }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {getRoleDisplay(user.role)}</p>
        <p><strong>Registered At:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "Unknown"}</p>
      </div>
    </div>
  );
};

export default Profile;