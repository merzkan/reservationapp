import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchSettingsAPI = async () => {
  try {
    const { data } = await api.get("/setting");
    return data;
  } catch (err) {
    console.error("Ayarlar alınamadı:", err);
    return [];
  }
};

export const saveSettingsAPI = async (settings) => {
  try {
    const { data } = await api.put("/setting", { settings });
    return data;
  } catch (err) {
    console.error("Ayarlar kaydedilemedi:", err);
    throw err;
  }
};

export const fetchExceptionsAPI = async () => {
  try {
    const { data } = await api.get("/exceptions");
    return data;
  } catch (err) {
    console.error("İstisnalar alınamadı:", err);
    return [];
  }
};

export const addExceptionAPI = async (exception) => {
  try {
    const { data } = await api.post("/exceptions", exception);
    return data;
  } catch (err) {
    console.error("İstisna eklenemedi:", err);
    throw err;
  }
};

export const deleteExceptionAPI = async (id) => {
  try {
    const { data } = await api.delete(`/exceptions/${id}`);
    return data;
  } catch (err) {
    console.error("İstisna silinemedi:", err);
    throw err;
  }
};
