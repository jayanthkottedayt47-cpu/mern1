// client/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "") + "/api", // make sure REACT_APP_API_URL is set in Netlify
  withCredentials: true, // only if you use cookies / credentials
});

export const registerUser = (payload) => API.post("/auth/register", payload);
export const loginUser = (payload) => API.post("/auth/login", payload);
export const getExpenses = (token) => API.get("/expenses", { headers: { Authorization: `Bearer ${token}` }});
// ...other exports
export default API;
