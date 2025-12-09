// client/src/components/SalaryInput.js
import React, { useEffect, useState } from "react";

export default function SalaryInput({ onSalaryChange }) {
  const [salary, setSalary] = useState(() => {
    const s = localStorage.getItem("salary");
    return s ? Number(s) : "";
  });

  useEffect(() => {
    if (onSalaryChange) onSalaryChange(Number(salary) || 0);
  }, [salary]);

  const save = () => {
    const val = Number(salary) || 0;
    localStorage.setItem("salary", String(val));
    if (onSalaryChange) onSalaryChange(val);
    alert("Salary saved");
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Monthly Salary (₹)</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="form-control"
          type="number"
          min="0"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          placeholder="Enter your monthly salary"
        />
        <button className="btn-primary" onClick={save} style={{ width: 140 }}>
          Save
        </button>
      </div>
    </div>
  );
}
