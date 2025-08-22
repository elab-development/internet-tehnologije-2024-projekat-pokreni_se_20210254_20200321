import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Button from "../components/Button";
import { fetchEvents } from "../services/eventService";
import { fetchSports } from "../services/sportService";
import "../styles.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    sport: "",
    location: "",
    date: "",
    sort: "date",
    status: "all"
  });

  useEffect(() => {
    loadEvents();
    loadSports();
  }, [pagination.current_page, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetchEvents(pagination.current_page, filters);
      setEvents(response.events);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSports = async () => {
    try {
      const sportsData = await fetchSports();
      setSports(sportsData);
    } catch (error) {
      console.error("Error loading sports:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      sport: "",
      location: "",
      date: "",
      sort: "date",
      status: "all"
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const hasFilters = Object.values(filters).some(value => value !== "" && value !== "date" && value !== "all");

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🏆 Sports Events</h1>
      
      {/* 🔍 Search & Filters */}
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search events..." 
          value={filters.search} 
          onChange={(e) => handleFilterChange('search', e.target.value)} 
          className="input-box" 
        />
        <select 
          value={filters.sport} 
          onChange={(e) => handleFilterChange('sport', e.target.value)} 
          className="input-box"
        >
          <option value="">All Sports</option>
          {sports.map(sportItem => (
            <option key={sportItem.id} value={sportItem.name}>
              {sportItem.name}
            </option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Location..." 
          value={filters.location} 
          onChange={(e) => handleFilterChange('location', e.target.value)} 
          className="input-box" 
        />
        <input 
          type="date" 
          value={filters.date} 
          onChange={(e) => handleFilterChange('date', e.target.value)} 
          className="input-box" 
        />
        <select 
          value={filters.sort} 
          onChange={(e) => handleFilterChange('sort', e.target.value)} 
          className="input-box"
        >
          <option value="date">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
        <select 
          value={filters.status || 'all'} 
          onChange={(e) => handleFilterChange('status', e.target.value)} 
          className="input-box"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Only</option>
          <option value="past">Past Events</option>
        </select>
        {hasFilters && (
          <Button onClick={resetFilters} variant="secondary" size="small">
            Clear Filters
          </Button>
        )}
      </div>

      {/* 🎴 Event List */}
      <div className="event-grid">
        {events.length > 0 ? (
          events.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.last_page > 1 && (
        <div className="pagination">
          <Button 
            onClick={() => handlePageChange(pagination.current_page - 1)} 
            disabled={pagination.current_page === 1}
            variant="secondary"
            size="small"
          >
            ← Prev
          </Button>
          <span className="pagination-info">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button 
            onClick={() => handlePageChange(pagination.current_page + 1)} 
            disabled={pagination.current_page === pagination.last_page}
            variant="secondary"
            size="small"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;