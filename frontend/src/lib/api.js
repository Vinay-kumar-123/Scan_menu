import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 AUTO ATTACH JWT TOKEN */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔑 SAME token jo login pe save hota hai
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);




/* AUTH */
export const authAPI = {
  signup: (data) => apiClient.post("/auth/signup", data),
  login: (data) => apiClient.post("/auth/login", data),
};

export const subscriptionAPI = {
  createOrder: () => apiClient.post("/subscription/create-order"),
  verifyPayment: (data) => apiClient.post("/subscription/verify-payment", data),
};