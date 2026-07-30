import { create } from "zustand";
import { apiClient } from "@/lib/api";

export interface RegisterFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  password: string;
  nin?: string;
  gender: string;
  address: string;
  stateOfResidence: string;
  residenceLga: string;
  stateOfOrigin: string;
  lga: string;
  dateOfBirth: string;
  parentNin?: string;
}

export interface OfficerRegisterFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  nin: string;
  lga: string;
  residenceLga: string;
  gender: string;
  address: string;
  stateOfResidence: string;
  stateOfOrigin: string;
  dateOfBirth: string;
  specialty: string;
}

/** Utility to decode and extract user role from user object or JWT token payload */
export function extractUserRole(user: any, token: string | null): string {
  if (!user && !token) return "GUEST";

  // Check direct user object fields
  const directRole = user?.role || user?.data?.role || user?.user?.role || user?.roleName;
  if (directRole) return String(directRole).toUpperCase();

  // Inspect JWT access token payload if available
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        const jwtRole = payload.role || payload.roles?.[0] || payload.userRole || payload.authorities?.[0];
        if (jwtRole) return String(jwtRole).toUpperCase();
      }
    } catch (e) {
      console.error("Error decoding JWT role:", e);
    }
  }

  return "CITIZEN";
}

/** Check if a role string matches super_admin, agency_admin, or field_officer roles */
export function isAdminRole(role: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase();
  return (
    normalized === "super_admin" ||
    normalized === "agency_admin" ||
    normalized === "admin" ||
    normalized === "superadmin" ||
    normalized === "agencyadmin" ||
    normalized === "field_officer" ||
    normalized === "field_officer_health" ||
    normalized === "field_officer_education"
  );
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
  progressiveQuestions: any[] | null;
  citizenCode: string | null;

  // UI State
  loading: boolean;
  error: string | null;
  success: boolean;
  successData: any | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  setProgressiveQuestions: (questions: any[] | null) => void;
  setCitizenCode: (code: string | null) => void;
  login: (identifier: string, password: string) => Promise<boolean>;
  adminLogin: (code: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearAuth: () => void;
  initializeAuth: () => Promise<boolean>;
  registerCitizen: (data: RegisterFormData) => Promise<boolean>;
  registerOfficer: (data: OfficerRegisterFormData) => Promise<any>;
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
  residenceLga: "",
  stateOfOrigin: "",
  lga: "",
  dateOfBirth: "",
  parentNin: "",
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
  progressiveQuestions: null,
  citizenCode: null,

  loading: false,
  error: null,
  success: false,
  successData: null,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  setUser: (user) =>
    set({ user }),

  setProgressiveQuestions: (questions) =>
    set({ progressiveQuestions: questions }),

  setCitizenCode: (code) =>
    set({ citizenCode: code }),

  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      // Calls the backend citizen login endpoint
      const response = await apiClient.post("/api/auth/citizen/login", {
        identifier,
        password,
      });

      const user = response.data;
      const token = response.data.token || response.data.data; // JWT access token
      const citizenCode = response.data.citizenCode || (user && (user.citizenCode || user.data?.citizenCode)) || "";
      const progressiveQuestions = response.data.pendingQuestions || [];

      if (typeof window !== "undefined") {
        localStorage.setItem("citi_user", JSON.stringify(user));
      }

      set({
        accessToken: token,
        user: user,
        citizenCode: citizenCode,
        progressiveQuestions: progressiveQuestions,
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

  adminLogin: async (code, password) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/api/auth/admin/login", {
        code,
        password,
      });

      const user = response.data;
      const token = response.data.token;

      set({
        accessToken: token,
        user: user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      console.error("Admin Login error:", err);
      const errMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "An unexpected error occurred during admin login.";
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
        citizenCode: null,
        progressiveQuestions: null,
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
      citizenCode: null,
      progressiveQuestions: null,
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
      let citizenCode = null;
      let progressiveQuestions = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("citi_user");
        if (userStr) {
          try {
            storedUser = JSON.parse(userStr);
            citizenCode = storedUser.citizenCode || (storedUser.data && storedUser.data.citizenCode) || null;
            progressiveQuestions = storedUser.pendingQuestions || null;
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
          }
        }
      }

      set({
        accessToken: newAccessToken,
        user: storedUser,
        citizenCode: citizenCode,
        progressiveQuestions: progressiveQuestions,
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (err) {
      // Silent refresh failed, reset auth state
      set({
        accessToken: null,
        user: null,
        citizenCode: null,
        progressiveQuestions: null,
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
      const token = response.data.token || response.data.data; // support both
      const citizenCode = response.data.citizenCode || (user && (user.citizenCode || user.data?.citizenCode)) || "";
      const progressiveQuestions = response.data.pendingQuestions || [];

      if (typeof window !== "undefined") {
        localStorage.setItem("citi_user", JSON.stringify(user));
      }

      set({
        accessToken: token,
        user: user,
        citizenCode: citizenCode,
        progressiveQuestions: progressiveQuestions,
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

  registerOfficer: async (data: OfficerRegisterFormData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await apiClient.post(
        "/api/auth/register/officer",
        data
      );
      const user = response.data;
      const token = response.data.token || response.data.data;
      const citizenCode = response.data.citizenCode || (user && (user.citizenCode || user.data?.citizenCode)) || "";

      if (typeof window !== "undefined") {
        localStorage.setItem("citi_user", JSON.stringify(user));
      }

      set({
        accessToken: token,
        user: user,
        citizenCode: citizenCode,
        isAuthenticated: !!token,
        loading: false,
        success: true,
        successData: response.data,
      });
      return response.data;
    } catch (err: any) {
      console.error("Officer Registration error:", err);
      const errMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "An unexpected error occurred during officer registration.";
      set({ loading: false, error: errMsg });
      return null;
    }
  },
}));

