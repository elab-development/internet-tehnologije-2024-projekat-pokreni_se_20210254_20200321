import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import MyEvents from "./pages/MyEvents";
import Navbar from "./components/Navbar";
import "./styles.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/my-events" element={<MyEvents />} /> {}
      </Routes>
    </Router>
  );
}

export default App;