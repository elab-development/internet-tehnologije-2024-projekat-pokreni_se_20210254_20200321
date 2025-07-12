import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <Link to="/">🏠 Home</Link>
      {isAuthenticated && <Link to="/my-events">📋 My Events</Link>}
      {isAuthenticated ? (
        <>
          <Link to="/profile">👤 Profile</Link>
          {user?.role === "admin" && <Link to="/admin">🔧 Admin</Link>}
          <button onClick={handleLogout}>🚪 Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">🔑 Login</Link>
          <Link to="/register">📝 Register</Link>
        </>
      )}
      <Link to="/create-event">+ New Event</Link>
    </nav>
  );
};

export default Navbar;