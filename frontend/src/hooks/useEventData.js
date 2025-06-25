import { useState, useEffect } from "react";
import { fetchEvents } from "../services/eventService";

const useEventData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return { events, loading };
};

export default useEventData;