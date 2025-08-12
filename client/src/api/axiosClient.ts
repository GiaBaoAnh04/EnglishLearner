// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "https://idiom-community.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false, // bật true nếu backend dùng cookie/session
// });

// // Optional: interceptor để log hoặc xử lý token
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosClient;

import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://idiom-community.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Safe interceptor cho SSR
axiosClient.interceptors.request.use((config) => {
  // Chỉ truy cập localStorage khi ở client-side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Optional: Response interceptor để handle 401 errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login nếu cần
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
