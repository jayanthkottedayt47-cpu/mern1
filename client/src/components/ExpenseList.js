// client/src/components/ExpenseList.js
import React from "react";

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

export default function ExpenseList({ expenses = [], onEdit, onDelete }) {
  if (!expenses.length) {
    return <div className="text-muted">No expenses yet. Add your first expense.</div>;
  }

  return (
    <ul className="list-group" style={{ margin: 0 }}>
      {expenses.map((e) => (
        <li key={e._id || e.id} className="list-group-item">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              ₹{e.amount} — <span style={{ fontWeight: 600, fontStyle: "italic" }}>{e.category}</span>
            </div>

            <div className="expense-meta" style={{ marginTop: 6 }}>
              {fmtDate(e.date)}
            </div>

            {e.edited && (
              <div className="edit-history" style={{ marginTop: 8 }}>
                <span style={{ color: "#2563eb", fontWeight: 700 }}>Edited:</span>{" "}
                <span style={{ color: "#334155" }}>{e.edited}</span>
              </div>
            )}

            {e.notes && (
              <div style={{ marginTop: 8, color: "#475569" }}>
                {e.notes}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-sm" style={{ background: "#fff", border: "1px solid #cbd5e1" }} onClick={() => onEdit(e)}>Edit</button>
            <button className="btn-small" style={{ background: "#ef4444" }} onClick={() => onDelete(e._id || e.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
