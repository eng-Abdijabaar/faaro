import { useEffect, } from "react";

import { Link, useSearchParams, } from "react-router";

import { CheckCircle2, Clock3, LoaderCircle, XCircle, } from "lucide-react";

import Navbar from "../components/Navbar";
import usePaymentStore from "../store/paymentStore";


const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const verification = usePaymentStore(
      (state) =>
        state.verification
    );

  const isPaymentLoading = usePaymentStore(
      (state) =>
        state.isPaymentLoading
    );

  const paymentError = usePaymentStore(
      (state) =>
        state.paymentError
    );

  const verifyCheckoutSession = usePaymentStore(
      (state) =>
        state.verifyCheckoutSession
    );

  /* ===========================
     VERIFY PAYMENT
  =========================== */

  useEffect(() => {
    if (!sessionId) return;

    verifyCheckoutSession(
      sessionId
    ).catch(() => {});
  }, [ sessionId, verifyCheckoutSession, ]);

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-[700px] items-center justify-center px-5 py-16">

        <div className="w-full rounded-[28px] border border-border bg-white p-8 text-center shadow-sm sm:p-12">

          {/* ===================
              MISSING SESSION
          =================== */}

          {!sessionId ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-danger">

                <XCircle
                  size={38}
                />

              </div>

              <h1 className="mt-6 text-3xl font-bold text-secondary">
                Invalid payment return
              </h1>

              <p className="mt-4 text-text-secondary">
                Stripe session
                information is missing.
              </p>

              <Link
                to="/bookings"
                className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
              >
                My Bookings
              </Link>
            </>
          ) : isPaymentLoading ? (
            /* ===================
                LOADING
            =================== */

            <>
              <LoaderCircle
                size={45}
                className="mx-auto animate-spin text-primary"
              />

              <h1 className="mt-6 text-2xl font-bold text-secondary">
                Verifying payment
              </h1>

              <p className="mt-3 text-text-secondary">
                Confirming your
                payment with Stripe.
              </p>
            </>
          ) : paymentError ? (
            /* ===================
                ERROR
            =================== */

            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-danger">

                <XCircle
                  size={38}
                />

              </div>

              <h1 className="mt-6 text-3xl font-bold text-secondary">
                Payment verification failed
              </h1>

              <p className="mt-4 text-text-secondary">
                {paymentError}
              </p>

              <Link
                to="/bookings"
                className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
              >
                My Bookings
              </Link>
            </>
          ) : verification ? (
            /* ===================
                SUCCESS
            =================== */

            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-success">

                <CheckCircle2
                  size={40}
                />

              </div>

              <h1 className="mt-6 text-3xl font-bold text-secondary">
                Payment successful
              </h1>

              <p className="mt-4 leading-7 text-text-secondary">
                Your payment was
                successfully verified.
              </p>

              <div className="mt-8 rounded-2xl bg-surface-soft p-5 text-left">

                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Booking ID
                </p>

                <p className="mt-2 break-all font-semibold text-secondary">
                  {
                    verification.bookingId
                  }
                </p>

                <div className="mt-5 flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      verification.isValid
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  />

                  <p className="text-sm font-medium text-text-secondary">

                    {verification.isValid
                      ? "Booking confirmed"
                      : "Payment verified — booking confirmation is being finalized"}

                  </p>

                </div>

              </div>

              {!verification.isValid && (
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-left">

                  <Clock3
                    size={20}
                    className="mt-0.5 shrink-0 text-warning"
                  />

                  <p className="text-sm leading-6 text-text-secondary">
                    Stripe confirmed the
                    payment. The webhook
                    performs the final
                    booking validation.
                  </p>

                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                <Link
                  to={`/bookings/${verification.bookingId}`}
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
                >
                  View Booking
                </Link>

                <Link
                  to="/bookings"
                  className="rounded-xl border border-border px-6 py-3 font-semibold text-secondary"
                >
                  My Bookings
                </Link>

              </div>
            </>
          ) : null}

        </div>

      </main>

    </div>
  );
};


export default PurchaseSuccess;