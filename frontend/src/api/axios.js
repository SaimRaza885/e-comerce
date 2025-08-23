import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // send cookies (access + refresh tokens)
});

// 🔑 Request interceptor – attach access token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response interceptor – auto refresh if 401 (JWT expired)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call backend refresh endpoint
        const { data } = await api.post("/users/refresh");

        // Save new access token in localStorage
        localStorage.setItem("accessToken", data.data.accessToken);

        // Update request headers with new token
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        // Retry the failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        localStorage.removeItem("accessToken"); // clear token
        // 🔴 Optionally redirect to login page here
      }
    }

    return Promise.reject(err);
  }
);

export default api;
