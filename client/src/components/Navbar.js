// client/src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="nav-root" role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="Expense Tracker home">Expense Tracker</Link>

        <div className="nav-actions" role="region" aria-label="User actions">
          {user ? (
            <>
              <span className="nav-hello" title={`Signed in as ${user.name}`}>Hi, <strong>{user.name?.split(" ")[0]}</strong></span>
              <button className="btn btn-ghost small" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost small">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
