import axios from "axios";

const isProd = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProd ? "/api" : import.meta.env.VITE_API_URL,
  withCredentials: true, // gửi cookie (refresh token)
});

const refreshApi = axios.create({
  baseURL: isProd ? "/api" : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // tránh loop refresh chính nó
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await refreshApi.post(
          "/auth/refresh-token"
        );

        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // refresh fail → logout
        localStorage.removeItem("accessToken");

        window.location.replace("/login"); // replace tốt hơn href

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
