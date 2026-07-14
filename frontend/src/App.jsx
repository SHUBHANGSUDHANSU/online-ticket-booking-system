import { useState } from "react";

import BookingHistory from "./components/BookingHistory.jsx";
import Events from "./components/Events.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import SeatSelection from "./components/SeatSelection.jsx";


function getStoredUser() {
  try {
    const user = localStorage.getItem("ticketBookingUser");
    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch {
    // If localStorage contains old or invalid data, clear it instead of
    // crashing the React app and showing a blank screen.
    try {
      localStorage.removeItem("ticketBookingUser");
    } catch {
      // Some browser privacy modes can block storage access completely.
    }

    return null;
  }
}


function App() {
  const [user, setUser] = useState(getStoredUser);
  const [page, setPage] = useState(user ? "events" : "login");
  const [selectedEvent, setSelectedEvent] = useState(null);

  function handleLogin(loggedInUser) {
    localStorage.setItem("ticketBookingUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setPage("events");
  }

  function handleLogout() {
    localStorage.removeItem("ticketBookingUser");
    setUser(null);
    setSelectedEvent(null);
    setPage("login");
  }

  function openSeats(event) {
    setSelectedEvent(event);
    setPage("seats");
  }

  return (
    <div className="app">
      <header className="top-bar">
        <div>
          <span className="brand-kicker">FastAPI + React Project</span>
          <h1>Online Ticket Booking System</h1>
          <p>Book simple event tickets with seat availability checks.</p>
        </div>

        <nav className="nav-actions">
          {!user && <button onClick={() => setPage("register")}>Register</button>}
          {!user && <button onClick={() => setPage("login")}>Login</button>}
          {user && <button onClick={() => setPage("events")}>Events</button>}
          {user && <button onClick={() => setPage("history")}>Booking History</button>}
          {user && <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>

      {user && (
        <div className="user-strip">
          Logged in as <strong>{user.name}</strong> ({user.email})
        </div>
      )}

      <main className="content">
        {page === "register" && <Register onSwitchToLogin={() => setPage("login")} />}
        {page === "login" && <Login onLogin={handleLogin} />}
        {page === "events" && <Events onViewSeats={openSeats} />}
        {page === "seats" && selectedEvent && (
          <SeatSelection
            event={selectedEvent}
            user={user}
            onBack={() => setPage("events")}
            onViewHistory={() => setPage("history")}
          />
        )}
        {page === "history" && <BookingHistory user={user} />}
      </main>
    </div>
  );
}


export default App;
