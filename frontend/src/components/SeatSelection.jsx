import { useEffect, useState } from "react";

import { api } from "../api.js";


function SeatSelection({ event, user, onBack, onViewHistory }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const availableSeats = seats.filter((seat) => !seat.is_booked).length;
  const bookedSeats = seats.filter((seat) => seat.is_booked).length;

  async function loadSeats() {
    setLoading(true);
    setError("");

    try {
      const data = await api.getSeats(event.id);
      setSeats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSeats();
  }, [event.id]);

  async function bookTicket() {
    setMessage("");
    setError("");

    if (!user) {
      setError("Please login before booking a ticket.");
      return;
    }

    if (!selectedSeat) {
      setError("Please select an available seat.");
      return;
    }

    try {
      const booking = await api.createBooking({
        user_id: user.id,
        event_id: event.id,
        seat_id: selectedSeat.id,
      });

      setMessage(`Ticket booked successfully for seat ${booking.seat_number}.`);
      setSelectedSeat(null);
      await loadSeats();
    } catch (err) {
      setError(err.message);
      await loadSeats();
    }
  }

  return (
    <section className="seat-page">
      <div className="seat-hero">
        <div className="seat-hero-copy">
          <span className="event-badge">Seat Selection</span>
          <h2>{event.title}</h2>
          <div className="seat-hero-meta">
            <span>{event.venue}</span>
            <span>{event.date}</span>
          </div>
        </div>

        <div className="seat-hero-actions">
          <button className="secondary-button" onClick={onBack}>Back to Events</button>
        </div>
      </div>

      {loading && <p>Loading seats...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && (
        <>
          <div className="seat-summary">
            <span>{availableSeats} available</span>
            <span>{bookedSeats} booked</span>
            <span>{event.total_seats} total</span>
          </div>

          <div className="seat-workspace">
            <div className="seat-map-panel">
              <div className="seat-map-heading">
                <div>
                  <h3>Choose Your Seat</h3>
                  <p>{availableSeats} seats currently open</p>
                </div>
              </div>

              <div className="seat-grid">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={
                      selectedSeat?.id === seat.id
                        ? "seat selected"
                        : seat.is_booked
                          ? "seat booked"
                          : "seat available"
                    }
                    disabled={seat.is_booked}
                    onClick={() => setSelectedSeat(seat)}
                  >
                    <span>{seat.seat_number}</span>
                  </button>
                ))}
              </div>

              <div className="legend">
                <span><b className="dot available-dot"></b> Available</span>
                <span><b className="dot selected-dot"></b> Selected</span>
                <span><b className="dot booked-dot"></b> Booked</span>
              </div>
            </div>

            <aside className="booking-panel">
              <span className="booking-panel-label">Booking Details</span>
              <h3>{selectedSeat ? `Seat ${selectedSeat.seat_number}` : "No seat selected"}</h3>
              <div className="booking-panel-list">
                <span>
                  <b>Event</b>
                  {event.title}
                </span>
                <span>
                  <b>Venue</b>
                  {event.venue}
                </span>
                <span>
                  <b>Date</b>
                  {event.date}
                </span>
              </div>

              <div className="booking-actions">
                <button onClick={bookTicket} disabled={!selectedSeat}>
                  Book Ticket
                </button>
                <button className="secondary-button" onClick={onViewHistory}>
                  View Booking History
                </button>
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}


export default SeatSelection;
