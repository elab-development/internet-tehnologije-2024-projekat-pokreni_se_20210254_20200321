import { useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import EventCard from "../components/EventCard";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  // 🔍 Apply Filters
  const filteredEvents = events.filter(event =>
    (search === "" || event.name.toLowerCase().includes(search.toLowerCase())) &&
    (sport === "" || event.sport.toLowerCase() === sport.toLowerCase()) &&
    (location === "" || event.location.toLowerCase().includes(location.toLowerCase())) &&
    (date === "" || new Date(event.date) >= new Date(date))
  );

  // 📌 Apply Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
    return 0;
  });

  return (
    <div className="container">
      <h1>🏆 Find Your Next Event</h1>

      {/* 🔍 Filters */}
      <div className="filters">
        <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-box" />
        <select value={sport} onChange={(e) => setSport(e.target.value)} className="input-box">
          <option value="">All Sports</option>
          <option value="Basketball">Basketball</option>
          <option value="Soccer">Soccer</option>
          <option value="Tennis">Tennis</option>
        </select>
        <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className="input-box" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-box" />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="input-box">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* 🎴 Event List */}
      <div className="event-grid">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;