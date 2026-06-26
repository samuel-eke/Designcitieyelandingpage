import { create } from "zustand";
import axios from "axios";

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
  dateOfBirth: string;
  desiredSupport: string;
}

interface AuthState {
  // Form State
  registerData: RegisterFormData;
  setRegisterData: (data: Partial<RegisterFormData>) => void;
  resetRegisterForm: () => void;

  // UI State
  loading: boolean;
  error: string | null;
  success: boolean;
  successData: any | null;

  // Actions
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

  loading: false,
  error: null,
  success: false,
  successData: null,

  registerCitizen: async (data) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register/citizen",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ loading: false, success: true, successData: response.data });
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
