import { create } from "zustand";
import { apiClient } from "@/lib/api";

export interface RegisterFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  nin: string;
  gender: string;
  address: string;
  stateOfResidence: string;
  stateOfOrigin: string;
  dateOfBirth: string;
  desiredSupport: string;
}

interface AuthState {
  // Form State
  registerData: RegisterFormData;
  setRegisterData: (data: Partial<RegisterFormData>) => void;
  resetRegisterForm: () => void;

  // Auth State
  accessToken: string | null;
  user: any | null;
  isAuthenticated: boolean;

  // UI State
  loading: boolean;
  error: string | null;
  success: boolean;
  successData: any | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearAuth: () => void;
  initializeAuth: () => Promise<boolean>;
  registerCitizen: (data: RegisterFormData) => Promise<boolean>;
}

const initialRegisterData: RegisterFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  nin: "",
  gender: "",
  address: "",
  stateOfResidence: "",
  stateOfOrigin: "",
  dateOfBirth: "",
  desiredSupport: "",
};

export const useAuthStore = create<AuthState>((set) => ({
  registerData: initialRegisterData,
  setRegisterData: (data) =>
    set((state) => ({ registerData: { ...state.registerData, ...data } })),
  resetRegisterForm: () =>
    set({
      registerData: initialRegisterData,
      loading: false,
      error: null,
      success: false,
      successData: null,
    }),

  // Initial Auth State
  accessToken: null,
  user: null,
  isAuthenticated: false,

  loading: false,
  error: null,
  success: false,
  successData: null,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  setUser: (user) =>
    set({ user }),

  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      // Calls the backend citizen login endpoint
      const response = await apiClient.post("/api/auth/citizen/login", {
        identifier,
        password,
      });

      const user = response.data;
      const token = response.data.data; // JWT access token

      if (typeof window !== "undefined") {
        localStorage.setItem("citi_user", JSON.stringify(user));
      }

      set({
        accessToken: token,
        user: user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      const errMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "An unexpected error occurred during login.";
      set({ loading: false, error: errMsg });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      // Call backend logout endpoint to revoke refresh token, including cookies
      await apiClient.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      // Always clear local state even if the request fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("citi_user");
      }
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
    return true;
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("citi_user");
    }
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initializeAuth: async () => {
    try {
      // Silently refresh the token upon application startup
      const response = await apiClient.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      const newAccessToken = response.data.accessToken;

      let storedUser = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("citi_user");
        if (userStr) {
          try {
            storedUser = JSON.parse(userStr);
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
          }
        }
      }

      set({
        accessToken: newAccessToken,
        user: storedUser,
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (err) {
      // Silent refresh failed, reset auth state
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
      return false;
    }
  },

  registerCitizen: async (data) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await apiClient.post(
        "/api/auth/register/citizen",
        data
      );
      const user = response.data;
      const token = response.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("citi_user", JSON.stringify(user));
      }

      set({
        accessToken: token,
        user: user,
        isAuthenticated: true,
        loading: false,
        success: true,
        successData: response.data,
      });
      return true;
    } catch (err: any) {
      console.error("Registration error:", err);
      const errMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "An unexpected error occurred during registration. Please check if the server is running.";
      set({ loading: false, error: errMsg });
      return false;
    }
  },
}));

