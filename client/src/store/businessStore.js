import { create } from "zustand";
import api from "../lib/axios";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    "Something went wrong"
  );
};

const useBusinessStore = create((set) => ({
  business: null,
  units: [],
  bookings: [],
  selectedBooking: null,
  verifiedBooking: null,

  isLoading: false,
  error: null,

  loadDashboard: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const [
        businessResponse,
        unitsResponse,
        bookingsResponse,
      ] = await Promise.all([
        api.get("/business/profile"),
        api.get("/business/units"),
        api.get("/business/booking"),
      ]);

      set({
        business: businessResponse.data.data,
        units: unitsResponse.data.data || [],
        bookings: bookingsResponse.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  getBusiness: async () => {
    const response = await api.get(
      "/business/profile"
    );

    const business = response.data.data;

    set({ business });

    return business;
  },

  getUnits: async () => {
    const response = await api.get(
      "/business/units"
    );

    const units = response.data.data || [];

    set({ units });

    return units;
  },

  createUnit: async (formData) => {
    const response = await api.post(
      "/business/units",
      formData
    );

    const unit = response.data.data;

    set((state) => ({
      units: [unit, ...state.units],
    }));

    return unit;
  },

  updateUnit: async (id, formData) => {
    const response = await api.patch(
      `/business/units/${id}`,
      formData
    );

    const updatedUnit = response.data.data;

    set((state) => ({
      units: state.units.map((unit) =>
        String(unit._id) === String(id)
          ? updatedUnit
          : unit
      ),
    }));

    return updatedUnit;
  },

  deactivateUnit: async (id) => {
    const response = await api.delete(
      `/business/units/${id}`
    );

    const updatedUnit = response.data.data;

    set((state) => ({
      units: state.units.map((unit) =>
        String(unit._id) === String(id)
          ? updatedUnit
          : unit
      ),
    }));

    return updatedUnit;
  },

  getBookings: async () => {
    const response = await api.get(
      "/business/booking"
    );

    const bookings = response.data.data || [];

    set({ bookings });

    return bookings;
  },

  getBookingById: async (id) => {
    const response = await api.get(
      `/business/booking/${id}`
    );

    const booking = response.data.data;

    set({
      selectedBooking: booking,
    });

    return booking;
  },

  checkBooking: async (bookingCode) => {
    try {
      set({
        verifiedBooking: null,
        error: null,
      });

      const response = await api.post(
        "/business/check-booking",
        {
          booking_code: bookingCode,
        }
      );

      const booking = response.data.data;

      set({
        verifiedBooking: booking,
      });

      return booking;
    } catch (error) {
      set({
        verifiedBooking: null,
      });

      throw error;
    }
  },

  clearVerifiedBooking: () => {
    set({
      verifiedBooking: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useBusinessStore;