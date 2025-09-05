import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchBookedTimesAPI = async (date) => {
  try {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const { data } = await api.get(`/reservation/all?date=${formattedDate}`);
    return data;
  } catch (err) {
    console.error("Rezervasyon bilgileri alınamadı:", err);
    return [];
  }
};

export const createReservationAPI = async ({ date, time, note }) => {
  try {
    const { data } = await api.post("/reservation", { date, time, note });
    return data;
  } catch (err) {
    console.error("Rezervasyon oluşturulamadı:", err);
    throw err;
  }
};

export const fetchUserReservationsAPI = async () => {
  try {
    const { data } = await api.get("/reservation/user");
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error("Rezervasyonlar alınamadı:", err);
    return [];
  }
};

export const cancelReservationAPI = async (resvId) => {
  const { data } = await api.patch(`/reservation/cancel/${resvId}`);
  return data;
};
