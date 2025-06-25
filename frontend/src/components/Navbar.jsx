import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <Link to="/">🏠 Home</Link>
      {isAuthenticated && <Link to="/my-events">📋 My Events</Link>}
      {isAuthenticated ? (
        <>
          <Link to="/profile">👤 Profile</Link>
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>🚪 Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">🔑 Login</Link>
          <Link to="/register">📝 Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;