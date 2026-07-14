import { useState } from "react";

import { api } from "../api.js";


function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.register(form);
      setForm({ name: "", email: "", password: "" });
      setMessage("Registration successful. You can login now.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel auth-panel">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Enter a password"
            required
          />
        </label>

        <button type="submit">Register</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <button className="link-button" onClick={onSwitchToLogin}>
        Already registered? Login
      </button>
    </section>
  );
}


export default Register;
