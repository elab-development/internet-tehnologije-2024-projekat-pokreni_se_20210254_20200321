import { useEffect, useState } from "react";
import { fetchSports } from "../services/sportService";
import EventCard from "../components/EventCard";
import useEventData from "../hooks/useEventData";

const Home = () => {
  const [sports, setSports] = useState([]);
  const {
    events,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    goToPage,
    hasFilters
  } = useEventData();

  // Fetch sports on mount
  useEffect(() => {
    const loadSports = async () => {
      const sportsData = await fetchSports();
      setSports(sportsData);
    };
    loadSports();
  }, []);

  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value });
  };

  const handlePageChange = (newPage) => {
    goToPage(newPage);
  };

  if (loading) {
    return <div className="container"><p>Loading events...</p></div>;
  }

  if (error) {
    return <div className="container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="container">
      <h1>🏆 Find Your Next Event</h1>

      {/* 🔍 Filters */}
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
          <button onClick={resetFilters} className="btn">Clear Filters</button>
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
  <div className="pagination" style={{ 
        display: "flex", 
        gap: 12, 
        justifyContent: "center", 
        marginTop: 32, 
        marginBottom: 32,
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
          <button 
            className="btn" 
            onClick={() => handlePageChange(pagination.current_page - 1)} 
            disabled={pagination.current_page === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: pagination.current_page === 1 ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: pagination.current_page === 1 ? "not-allowed" : "pointer"
            }}
          >
            ← Prev
          </button>
          <span style={{ 
            margin: '0 16px', 
            fontWeight: 600,
            fontSize: "16px",
            color: "#333"
          }}>
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button 
            className="btn" 
            onClick={() => handlePageChange(pagination.current_page + 1)} 
            disabled={pagination.current_page === pagination.last_page}
            style={{
              padding: "8px 16px",
              backgroundColor: pagination.current_page === pagination.last_page ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: pagination.current_page === pagination.last_page ? "not-allowed" : "pointer"
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;