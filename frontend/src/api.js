const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000");


async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}


export const api = {
  register(userData) {
    return request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login(loginData) {
    return request("/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },

  getEvents() {
    return request("/events");
  },

  getEvent(eventId) {
    return request(`/events/${eventId}`);
  },

  getSeats(eventId) {
    return request(`/events/${eventId}/seats`);
  },

  createBooking(bookingData) {
    return request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  cancelBooking(bookingId, userId) {
    return request(`/bookings/${bookingId}?user_id=${userId}`, {
      method: "DELETE",
    });
  },

  getUserBookings(userId) {
    return request(`/users/${userId}/bookings`);
  },
};
