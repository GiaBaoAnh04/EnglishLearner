import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // đổi theo URL backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // bật true nếu backend dùng cookie/session
});

// Optional: interceptor để log hoặc xử lý token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
