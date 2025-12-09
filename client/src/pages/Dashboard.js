// client/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../services/api";
import SalaryBar from "../components/SalaryBar";
import CategoryDonut from "../components/Charts";
import { exportCSV } from "../utils/exporters";

export default function Dashboard({ user, token, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [salary, setSalary] = useState(() => Number(localStorage.getItem("salary") || 0));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getExpenses(token);
      // interpret common response shapes
      let data = null;
      if (res && res.data) {
        if (Array.isArray(res.data)) data = res.data;
        else if (Array.isArray(res.data.expenses)) data = res.data.expenses;
        else data = res.data.expenses || res.data.items || res.data.data || null;
      } else if (Array.isArray(res)) data = res;
      if (!data) data = [];
      setExpenses(data.map(it => ({ ...it, _id: it._id || it.id })));
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) onLogout();
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    localStorage.setItem("salary", String(salary || 0));
  }, [salary]);

  const handleAdd = async (payload) => {
    try {
      if (editing) {
        await updateExpense(editing._id, payload, token);
        setEditing(null);
      } else {
        await createExpense(payload, token);
      }
      await load();
    } catch (err) { console.error(err); alert("Action failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try { await deleteExpense(id, token); await load(); }
    catch (err) { console.error(err); alert("Delete failed"); }
  };

  const handleEdit = (e) => { setEditing(e); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // monthly totals
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExpenses = expenses.filter(e => new Date(e.date) >= monthStart);
  const monthlyTotal = monthExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // by category for pie
  const byCategory = monthExpenses.reduce((acc, e) => { acc[e.category] = (acc[e.category]||0) + (Number(e.amount)||0); return acc; }, {});

  // filter & search
  const filtered = expenses.filter(e => {
    const q = query.trim().toLowerCase();
    const matchesQ = !q || String(e.notes || "").toLowerCase().includes(q) || String(e.amount || "").includes(q);
    const matchesCat = category === "All" || e.category === category;
    return matchesQ && matchesCat;
  });

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Welcome, {user?.name || "User"}</h2>
        <div style={{ textAlign: "right", minWidth: 260 }}>
          <div style={{ color: "#64748b", fontSize: 14 }}>Monthly summary</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>₹{monthlyTotal}</div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SalaryBar salary={salary} spent={monthlyTotal} />
        <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
          <input className="form-control" placeholder="Set monthly salary (₹)" value={salary || ""} onChange={e => setSalary(Number(e.target.value) || 0)} style={{ width: 220 }} />
          <button className="btn-ghost btn-sm" onClick={() => { localStorage.setItem("salary", String(salary || 0)); alert("Salary saved"); }}>Save</button>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="col-4">
          <div className="card">
            <div className="card-title">Add Expense</div>
            <ExpenseForm initial={editing} onSave={handleAdd} onCancel={() => setEditing(null)} />
          </div>

          <div style={{ height: 20 }} />

          <div className="card" style={{ marginTop: 12 }}>
            <div className="card-title">Categories</div>
            <CategoryDonut byCategory={byCategory} />

          </div>
        </div>

        <div className="col-8">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="card-title" style={{ margin: 0 }}>Expenses</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-sm btn-ghost" onClick={() => exportCSV("expenses.csv", (filtered || []).map(e => ({
                  date: e.date, category: e.category, amount: e.amount, notes: e.notes
                })))}>Export CSV</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input className="form-control" placeholder="Search notes or amount" value={query} onChange={e => setQuery(e.target.value)} />
              <select className="form-control" style={{ width: 180 }} value={category} onChange={e => setCategory(e.target.value)}>
                <option>All</option>
                {["Food","Transport","Shopping","Rent","Health","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {loading ? <div>Loading...</div> : <ExpenseList expenses={filtered} onEdit={handleEdit} onDelete={handleDelete} />}
          </div>
        </div>
      </div>
    </div>
  );
}
