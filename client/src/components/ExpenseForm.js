// client/src/components/ExpenseForm.js
import React, { useEffect, useState } from "react";

const defaultForm = { amount: "", category: "Food", date: "", notes: "" };

export default function ExpenseForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      // map fields safely (some backends use ISO date strings)
      setForm({
        amount: initial.amount ?? "",
        category: initial.category ?? "Food",
        date: initial.date ? initial.date.split("T")[0] : "",
        notes: initial.notes ?? ""
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // ensure amount as number
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        notes: form.notes
      };
      await onSave(payload);
      setForm(defaultForm);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        className="form-control"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        type="number"
        min="0"
        required
      />

      <select
        className="form-control"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Rent</option>
        <option>Health</option>
        <option>Other</option>
      </select>

      <input
        className="form-control"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        className="form-control"
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : initial ? "Update" : "Save"}
        </button>

        {initial && (
          <button
            type="button"
            className="btn-small"
            style={{ background: "#ef4444", marginLeft: 8 }}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
