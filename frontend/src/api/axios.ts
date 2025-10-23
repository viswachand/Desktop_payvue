import axios from "axios";
import { store } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { getStoredAuth } from "@/utils/storage";
import { redirectToLogin } from "@/utils/setupAutoLogout";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token ?? getStoredAuth()?.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

let handlingUnauthorized = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !handlingUnauthorized) {
      handlingUnauthorized = true;
      store.dispatch(logout());
      redirectToLogin();
      handlingUnauthorized = false;
    }
    return Promise.reject(error);
  }
);
