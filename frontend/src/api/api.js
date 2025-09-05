import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginAPI = async (email, password) => {
  const { data } = await api.post("/login", { email, password });
  return data;
};

export const registerAPI = async (userData) => {
  const { data } = await api.post("/register", userData);
  return data;
};

export default api;
