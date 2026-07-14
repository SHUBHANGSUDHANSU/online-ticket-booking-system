import { useEffect, useState } from "react";

import { api } from "../api.js";


function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function loadBookings() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.getUserBookings(user.id);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [user]);

  async function cancelBooking(bookingId) {
    const shouldCancel = window.confirm("Cancel this booking and make the seat available again?");
    if (!shouldCancel) {
      return;
    }

    setError("");
    setMessage("");
    setCancellingId(bookingId);

    try {
      const data = await api.cancelBooking(bookingId, user.id);
      setMessage(`${data.message}. Seat ${data.seat_number} is available again.`);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  if (!user) {
    return <p className="error">Please login to view booking history.</p>;
  }

  if (loading) {
    return <p>Loading booking history...</p>;
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Booking History</h2>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!error && bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>You have not booked any tickets yet.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event</th>
                <th>Seat</th>
                <th>Booking Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.event_title}</td>
                  <td>{booking.seat_number}</td>
                  <td>{new Date(booking.booking_time).toLocaleString()}</td>
                  <td>
                    <button
                      className="danger-button"
                      disabled={cancellingId === booking.booking_id}
                      onClick={() => cancelBooking(booking.booking_id)}
                    >
                      {cancellingId === booking.booking_id ? "Cancelling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


export default BookingHistory;
