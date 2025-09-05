import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUsers = async (page = 0, limit = 10, query = "") => {
  const url = query
    ? `/users/search?q=${query}&page=${page}&limit=${limit}`
    : `/users?page=${page}&limit=${limit}`;
  const { data } = await api.get(url);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/users/delete/${userId}`);
  return data;
};

export const updateUser = async (userId, newData) => {
  const { data } = await api.put(`/users/update/${userId}`, newData);
  return data;
};

export const fetchUserReservations = async (userId) => {
  const { data } = await api.get(`/reservation/user/${userId}`);
  return data;
};

export const fetchAllReservations = async () => {
  const { data } = await api.get("/reservation/all-user");
  return data;
};

export const updateReservationStatus = async (resvId, status) => {
  const { data } = await api.patch(`/reservation/${resvId}/status`, { status });
  return data;
};
