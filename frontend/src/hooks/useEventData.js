import { useState, useEffect, useCallback, useRef } from "react";
import { fetchEvents } from "../services/eventService";

const useEventData = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    sport: "",
    location: "",
    date: "",
    sort: "date",
    status: "all",
    ...initialFilters
  });

  const fetchEventData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters from filters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.sport) params.sport = filters.sport;
      if (filters.location) params.location = filters.location;
      if (filters.date) params.start_date = filters.date;
      if (filters.sort) params.sort = filters.sort;
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      
      const response = await fetchEvents(page, params);
      setEvents(response.events || []);
      setPagination(response.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      });
    } catch (err) {
      setError(err.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEventData(1);
  }, [fetchEventData]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      sport: "",
      location: "",
      date: "",
      sort: "date",
      status: "all"
    });
  }, []);

  const goToPage = useCallback((page) => {
    fetchEventData(page);
  }, [fetchEventData]);

  const refresh = useCallback(() => {
    fetchEventData(pagination.current_page);
  }, [fetchEventData, pagination.current_page]);

  return {
    events,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    goToPage,
    refresh,
    hasFilters: Object.values(filters).some(value => value !== "" && value !== "date" && value !== "all")
  };
};

export default useEventData;