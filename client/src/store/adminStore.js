import { create } from "zustand";
import api from "../lib/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Something went wrong";

const useAdminStore = create((set) => ({
  users: [],
  businesses: [],
  bookings: [],
  refunds: [],

  selectedUser: null,
  selectedBooking: null,
  selectedRefund: null,

  isLoading: false,
  error: null,

  /* =========================
     DASHBOARD
  ========================= */

  loadDashboard: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const safeGet = async (url) => {
        try {
          const response =
            await api.get(url);

          return response.data.data || [];
        } catch (error) {
          if (
            error.response?.status === 404
          ) {
            return [];
          }

          throw error;
        }
      };

      const [
        users,
        businesses,
        bookings,
        refunds,
      ] = await Promise.all([
        safeGet("/admin/users"),
        safeGet("/admin/users/owners"),
        safeGet("/admin/booking"),
        safeGet("/admin/refund"),
      ]);

      set({
        users,
        businesses,
        bookings,
        refunds,

        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          getErrorMessage(error),
      });

      throw error;
    }
  },

  /* =========================
     USERS
  ========================= */

  getUsers: async () => {
    try {
      const response =
        await api.get(
          "/admin/users"
        );

      const users =
        response.data.data || [];

      set({ users });

      return users;
    } catch (error) {
      if (
        error.response?.status === 404
      ) {
        set({ users: [] });

        return [];
      }

      throw error;
    }
  },

  getUserById: async (id) => {
    const response =
      await api.get(
        `/admin/users/${id}`
      );

    const user =
      response.data.data;

    set({
      selectedUser: user,
    });

    return user;
  },

  suspendUser: async (id) => {
    const response =
      await api.post(
        `/admin/users/suspend/${id}`
      );

    const updatedUser =
      response.data.user;

    set((state) => ({
      users: state.users.map(
        (user) =>
          String(user._id) ===
          String(id)
            ? {
                ...user,
                status:
                  updatedUser.status,
              }
            : user
      ),
    }));

    return updatedUser;
  },

  /* =========================
     BUSINESSES
  ========================= */

  getBusinesses: async () => {
    try {
      const response =
        await api.get(
          "/admin/users/owners"
        );

      const businesses =
        response.data.data || [];

      set({ businesses });

      return businesses;
    } catch (error) {
      if (
        error.response?.status === 404
      ) {
        set({
          businesses: [],
        });

        return [];
      }

      throw error;
    }
  },

  createBusiness: async ({
    userId,
    formData,
  }) => {
    const response =
      await api.post(
        `/admin/users/businessOwner/${userId}`,
        formData
      );

    const business =
      response.data.business;

    set((state) => ({
      businesses: [
        business,
        ...state.businesses,
      ],

      users: state.users.map(
        (user) =>
          String(user._id) ===
          String(userId)
            ? {
                ...user,
                role: "owner",
              }
            : user
      ),
    }));

    return response.data;
  },

  /* =========================
     BOOKINGS
  ========================= */

  getBookings: async () => {
    try {
      const response =
        await api.get(
          "/admin/booking"
        );

      const bookings =
        response.data.data || [];

      set({ bookings });

      return bookings;
    } catch (error) {
      if (
        error.response?.status === 404
      ) {
        set({ bookings: [] });

        return [];
      }

      throw error;
    }
  },

  getBookingById: async (id) => {
    const response =
      await api.get(
        `/admin/booking/${id}`
      );

    const booking =
      response.data.data;

    set({
      selectedBooking:
        booking,
    });

    return booking;
  },

  /* =========================
     REFUNDS
  ========================= */

  getRefunds: async () => {
    try {
      const response =
        await api.get(
          "/admin/refund"
        );

      const refunds =
        response.data.data || [];

      set({ refunds });

      return refunds;
    } catch (error) {
      if (
        error.response?.status === 404
      ) {
        set({ refunds: [] });

        return [];
      }

      throw error;
    }
  },

  getRefundById: async (id) => {
    const response = await api.get(
        `/admin/refund/${id}`
      );

    const refund =
      response.data.data;

    set({
      selectedRefund: refund,
    });

    return refund;
  },

  updateRefundStatus: async (
    id,
    status
  ) => {
    const response =
      await api.patch(
        `/admin/refund/${id}`,
        {
          status,
        }
      );

    const refund =
      response.data.data;

    set((state) => ({
      refunds:
        state.refunds.map(
          (item) =>
            String(item._id) ===
            String(id)
              ? refund
              : item
        ),

      selectedRefund:
        state.selectedRefund?._id ===
        id
          ? refund
          : state.selectedRefund,
    }));

    return refund;
  },

  clearAdminError: () => {
    set({
      error: null,
    });
  },
}));

export default useAdminStore;