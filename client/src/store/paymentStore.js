import { create } from "zustand";
import api from "../lib/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Payment request failed";

const usePaymentStore = create((set) => ({
  checkout: null,
  verification: null,

  isPaymentLoading: false,
  paymentError: null,

  createCheckoutSession: async (bookingId) => {
    try {
      set({
        isPaymentLoading: true,
        paymentError: null,
      });

      const response = await api.post(
        "/customer/payment",
        {
          id: bookingId,
        }
      );

      const checkout = response.data.data;

      set({
        checkout,
        isPaymentLoading: false,
      });

      return checkout;
    } catch (error) {
      set({
        isPaymentLoading: false,
        paymentError: getErrorMessage(error),
      });

      throw error;
    }
  },

  verifyCheckoutSession: async (sessionId) => {
    try {
      set({
        isPaymentLoading: true,
        paymentError: null,
        verification: null,
      });

      const response = await api.post(
        "/customer/payment/success",
        {
          sessionId,
        }
      );

      const verification = response.data.data;

      set({
        verification,
        isPaymentLoading: false,
      });

      return verification;
    } catch (error) {
      set({
        isPaymentLoading: false,
        paymentError: getErrorMessage(error),
      });

      throw error;
    }
  },

  clearPayment: () => {
    set({
      checkout: null,
      verification: null,
      paymentError: null,
    });
  },
}));

export default usePaymentStore;