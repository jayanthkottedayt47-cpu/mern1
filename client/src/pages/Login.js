// client/src/pages/Login.js
import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email: form.email.trim().toLowerCase(), password: form.password };
      const res = await loginUser(payload);
      onLogin(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: 420 }}>
        <h3 className="card-title">Welcome back</h3>

        <form onSubmit={submit}>
          <input className="form-control" name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input className="form-control" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center", color: "#64748b" }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
