import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://mern1-swzv.onrender.com", 
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
export const getExpenses = (token) => API.get("/api/expenses");
export const createExpense = (payload) => API.post("/api/expenses", payload);
export const updateExpense = (id, payload) => API.put(`/api/expenses/${id}`, payload);
export const deleteExpense = (id) => API.delete(`/api/expenses/${id}`);

