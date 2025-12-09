// client/src/components/SalaryBar.js
import React from "react";

export default function SalaryBar({ salary = 0, spent = 0 }) {
  const used = salary ? Math.min(100, Math.round((spent / salary) * 100)) : 0;
  const remaining = Math.max(0, salary - spent);
  const barStyle = { width: `${used}%` };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Monthly</div>
        <div style={{ color: "#64748b", fontSize: 14 }}>{`Spent ₹${spent} / ₹${salary || "—"}`}</div>
      </div>

      <div className="budget-bar" aria-hidden>
        <div className="budget-fill" style={barStyle}></div>
      </div>

      <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
        {salary ? `Remaining: ₹${remaining}` : "Set your salary to enable budget tracking."}
      </div>
    </div>
  );
}
