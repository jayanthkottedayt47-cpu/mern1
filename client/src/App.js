// client/src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const onLogin = (u, t) => {
    setUser(u);
    setToken(t);
  };

  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={onLogout} />

      <Routes>
        {/* Landing page: show marketing / get-started when NOT logged in.
            If logged-in, redirect root to dashboard. */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Landing />
          }
        />

        {/* direct dashboard route (protected) */}
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard user={user} token={token} onLogout={onLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* auth routes: if already logged in, send them to dashboard */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register onLogin={onLogin} />}
        />

        {/* fallback: send authenticated users to dashboard, others to landing */}
        <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
