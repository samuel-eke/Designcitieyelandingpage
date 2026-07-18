import axios from "axios";
import { useAuthStore } from "@/components/auth/authStore";

// Create configured Axios instance
export const apiClient = axios.create({
  baseURL: "",
  headers: {
    "withCredentials": true,
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 responses and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect 401 error and ensure it has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the refresh token request itself fails with a 401/400, do not retry
      if (originalRequest.url === "/api/auth/refresh") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // Silent token refresh request with credentials included (cookies attached)
        const response = await apiClient.post(
          "/api/auth/refresh"
        );

        const newAccessToken = response.data.accessToken;

        // Update Zustand store
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Process any requests waiting in the queue
        processQueue(null, newAccessToken);

        // Retry the original failed request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // If refresh fails (401 or 400), clear state and redirect to login page
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined") {
          // Redirect to login page immediately
          window.location.href = "/auth?mode=login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
