import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// EXPENSES
export const getExpenses = (token) =>
  API.get("/expenses", { headers: { Authorization: `Bearer ${token}` } });

export const createExpense = (data, token) =>
  API.post("/expenses", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateExpense = (id, data, token) =>
  API.put(`/expenses/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteExpense = (id, token) =>
  API.delete(`/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
