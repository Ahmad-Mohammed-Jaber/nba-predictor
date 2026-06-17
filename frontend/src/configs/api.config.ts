import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true
});

// Use a separate instance for refresh to avoid interceptor loops
const refreshApi = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true
});

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post("/auth/refresh");
        const { access_token } = res.data;

        setAccessToken(access_token);

        // Notify the rest of the app that the token was refreshed
        window.dispatchEvent(new CustomEvent("auth-token-refreshed", { detail: access_token }));

        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid/expired
        window.dispatchEvent(new CustomEvent("auth-session-expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
