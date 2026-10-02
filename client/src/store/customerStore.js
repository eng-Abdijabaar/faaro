import { create } from "zustand";
import api from "../lib/axios";

const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        "Something went wrong"
    );
};

const useCustomerStore = create((set) => ({
    /* =========================
       STATE
    ========================= */

    units: [],
    unit: null,

    businesses: [],
    business: null,

    booking: null,

    refunds: [],
    refund: null,

    bookings: [],
    bookingDetails: null,


    isLoading: false,
    error: null,

    /* =========================
       UNITS
    ========================= */

    getUnits: async () => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.get(
                "/customer/units"
            );

            const units = response.data.data;

            set({
                units,
                isLoading: false,
            });

            return units;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    getUnitById: async (id) => {
        try {
            set({
                isLoading: true,
                error: null,
                unit: null,
            });

            const response = await api.get(
                `/customer/units/${id}`
            );

            const unit = response.data.data;

            set({
                unit,
                isLoading: false,
            });

            return unit;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    /* =========================
       BUSINESSES
    ========================= */

    getBusinesses: async () => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.get(
                "/customer/businesses"
            );

            const businesses =
                response.data.data;

            set({
                businesses,
                isLoading: false,
            });

            return businesses;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    getBusinessById: async (id) => {
        try {
            set({
                isLoading: true,
                error: null,
                business: null,
            });

            const response = await api.get(
                `/customer/business/${id}`
            );

            const business =
                response.data.data;

            set({
                business,
                isLoading: false,
            });

            return business;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    /* =========================
       BOOKING
    ========================= */

    createBooking: async ({
        unitId,
        businessId,
        startDate,
        endDate,
        document,
    }) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const formData = new FormData();

            formData.append(
                "unitId",
                unitId
            );

            formData.append(
                "businessId",
                businessId
            );

            formData.append(
                "startDate",
                startDate
            );

            formData.append(
                "endDate",
                endDate
            );

            if (document) {
                formData.append(
                    "document",
                    document
                );
            }

            const response = await api.post(
                "/customer/booking",
                formData
            );

            const booking =
                response.data.data;

            set({
                booking,
                isLoading: false,
            });

            return booking;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },


    // GET MY BOOKINGS
    getBookings: async () => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.get(
                "/customer/bookings"
            );

            const bookings =
                response.data.data || [];

            set({
                bookings,
                isLoading: false,
            });

            return bookings;
        } catch (error) {
            if (error.response?.status === 404) {
                set({
                    bookings: [],
                    isLoading: false,
                    error: null,
                });

                return [];
            }

            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },


    getBookingById: async (id) => {
        try {
            set({
                isLoading: true,
                error: null,
                bookingDetails: null,
            });

            const response = await api.get(
                `/customer/bookings/${id}`
            );

            const booking = response.data.data;

            set({
                bookingDetails: booking,
                isLoading: false,
            });

            return booking;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    /* =========================
       REVIEWS
    ========================= */

    createReview: async ({
        businessId,
        unitId,
        stars,
        description,
    }) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/customer/reviews",
                {
                    businessId,
                    unitId,
                    stars,
                    description,
                }
            );

            set({
                isLoading: false,
            });

            return response.data.data;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    /* =========================
       REFUNDS
    ========================= */

    getRefunds: async () => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.get(
                "/customer/refund"
            );

            const refunds =
                response.data.data;

            set({
                refunds,
                isLoading: false,
            });

            return refunds;
        } catch (error) {
            /*
              Your backend currently returns
              404 when the customer has no
              refunds.
      
              For the UI we treat that as an
              empty refund list.
            */
            if (error.response?.status === 404) {
                set({
                    refunds: [],
                    isLoading: false,
                    error: null,
                });

                return [];
            }

            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    getRefundById: async (id) => {
        try {
            set({
                isLoading: true,
                error: null,
                refund: null,
            });

            const response = await api.get(
                `/customer/refund/${id}`
            );

            const refund =
                response.data.data;

            set({
                refund,
                isLoading: false,
            });

            return refund;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    requestRefund: async ({
        bookingId,
        unitId,
        reason,
    }) => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const response = await api.post(
                "/customer/refund",
                {
                    bookingId,
                    unitId,
                    reason,
                }
            );

            const refund =
                response.data.data;

            set((state) => ({
                refund,
                refunds: [
                    refund,
                    ...state.refunds,
                ],
                isLoading: false,
            }));

            return refund;
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
            });

            throw error;
        }
    },

    /* =========================
       HELPERS
    ========================= */

    clearCustomerError: () => {
        set({
            error: null,
        });
    },

    clearSelectedUnit: () => {
        set({
            unit: null,
            business: null,
        });
    },

    clearBooking: () => {
        set({
            booking: null,
        });
    },
}));

export default useCustomerStore;