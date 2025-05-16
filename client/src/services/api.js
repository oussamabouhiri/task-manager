import axios from "axios";
import { getAuthToken, getAuthUserId } from "../utils/tokenUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (token) {
      config.headers["x-auth-token"] = token;
      config.headers["user-id"] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we want to implement token refresh, we would do it here
      // For now, we'll just log the user out in the UI when they encounter a 401
    }

    return Promise.reject(error);
  }
);

// Export API base URL for other components to use
export const getApiBaseUrl = () => API_BASE_URL;

export default api;
