import axios from "axios";
// https://localhost:44311/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:44311/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});