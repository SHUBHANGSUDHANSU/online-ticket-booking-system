import { useState } from "react";

import { api } from "../api.js";


function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const data = await api.login(form);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel auth-panel">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}


export default Login;
