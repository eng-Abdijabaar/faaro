import { create } from "zustand";
import api, {
    setAccessToken,
} from "../lib/axios";

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,

    isAuthenticated: false,
    isLoading: false,
    initialized: false,

    error: null,

    /*
      REGISTER
    */
    register: async (formData) => {
        try {
            set({ isLoading: true, error: null, });

            const response = await api.post(
                "/auth/register",
                formData
            );

            set({ isLoading: false, });

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";

            set({ error: message, isLoading: false, });

            //   throw error;
            toast.error(message);
        }
    },

    /*
      LOGIN
    */
    login: async (credentials) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/auth/login",
                credentials
            );

            const {
                data: user,
                accessToken,
            } = response.data;

            setAccessToken(accessToken);

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
            });

            return user;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Login failed";

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: message,
            });

            throw error;
        }
    },

    /*
      RESTORE SESSION
    */
    initializeAuth: async () => {
        try {
            const response = await api.post(
                "/auth/refresh"
            );

            const {
                accessToken,
                data: user,
            } = response.data;

            setAccessToken(accessToken);

            set({
                user,
                accessToken,
                isAuthenticated: true,
                initialized: true,
            });
        } catch {
            setAccessToken(null);

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                initialized: true,
            });
        }
    },

    /*
      LOGOUT
    */
    logout: async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setAccessToken(null);

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
            });
        }
    },

    /*
      VERIFY EMAIL
    */
    verifyEmail: async (token) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/auth/verify-email",
                {
                    token,
                }
            );

            set({
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Email verification failed";

            set({
                error: message,
                isLoading: false,
            });

            throw error;
        }
    },

    /*
      FORGOT PASSWORD
    */
    forgotPassword: async (email) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email,
                }
            );

            set({
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Request failed";

            set({
                error: message,
                isLoading: false,
            });

            throw error;
        }
    },

    /*
      RESET PASSWORD
    */
    resetPassword: async ({
        token,
        password,
    }) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/auth/reset-password",
                {
                    token,
                    password,
                }
            );

            set({
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Password reset failed";

            set({
                error: message,
                isLoading: false,
            });

            throw error;
        }
    },

    clearError: () => {
        set({
            error: null,
        });
    },
}));

export default useAuthStore;