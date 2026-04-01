import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // CRITICAL: Ensure this is set to the correct backend URL in your .env file
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // CRITICAL: Ensure there is a SPACE after Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
