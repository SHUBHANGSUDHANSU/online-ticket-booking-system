import { useEffect, useState } from "react";

import { api } from "../api.js";


function Events({ onViewSeats }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const totalSeats = events.reduce((total, event) => total + event.total_seats, 0);
  const venues = new Set(events.map((event) => event.venue)).size;

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Available Events</h2>
          <p>Choose an event, check seat availability, and book your ticket.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Seats</span>
          <strong>{totalSeats}</strong>
        </div>
        <div className="stat-card">
          <span>Venues</span>
          <strong>{venues}</strong>
        </div>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <div className="event-card-top">
              <span className="event-badge">Event #{event.id}</span>
              <span className="seat-pill">{event.total_seats} seats</span>
            </div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="event-meta">
              <span>
                <b>Venue</b>
                {event.venue}
              </span>
              <span>
                <b>Date</b>
                {event.date}
              </span>
            </div>
            <button onClick={() => onViewSeats(event)}>View Seats</button>
          </article>
        ))}
      </div>
    </section>
  );
}


export default Events;
