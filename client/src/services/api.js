// client/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if present (helper)
export function setAuthToken(token) {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
}

/* ---------- Auth ---------- */
export const registerUser = (payload) => API.post("/api/auth/register", payload);
export const loginUser = (payload) => API.post("/api/auth/login", payload);
export const getProfile = () => API.get("/api/auth/me"); // optional endpoint

/* ---------- Expenses CRUD ---------- */

// GET /api/expenses  -> returns list (server-side may accept query params)
export const getExpenses = (token) => {
  if (token) setAuthToken(token);
  return API.get("/api/expenses");
};

// POST /api/expenses -> create new expense
export const createExpense = (payload, token) => {
  if (token) setAuthToken(token);
  return API.post("/api/expenses", payload);
};

// PUT or PATCH: update existing expense by id
// Server may accept PUT /api/expenses/:id or PATCH - adjust if your server uses PATCH
export const updateExpense = (id, payload, token) => {
  if (token) setAuthToken(token);
  // try PATCH first (safer), fallback to PUT if your server expects that
  return API.patch(`/api/expenses/${id}`, payload);
};

// DELETE /api/expenses/:id
export const deleteExpense = (id, token) => {
  if (token) setAuthToken(token);
  return API.delete(`/api/expenses/${id}`);
};

/* ---------- Export default (optional) ---------- */

// default export with the instance and helper just in case some files import default
export default {
  API,
  setAuthToken,
  registerUser,
  loginUser,
  getProfile,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
