import { Link } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Desktop Navigation */}
      <div className="nav-desktop">
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
      </div>

      {/* Mobile Navigation */}
      <div className="nav-mobile">
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
        
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
            {isAuthenticated && <Link to="/my-events" onClick={() => setIsMenuOpen(false)}>📋 My Events</Link>}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>👤 Profile</Link>
                {user?.role === "admin" && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>🔧 Admin</Link>}
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>🔑 Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>📝 Register</Link>
              </>
            )}
            <Link to="/create-event" onClick={() => setIsMenuOpen(false)}>+ New Event</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;