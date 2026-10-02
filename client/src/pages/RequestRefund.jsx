import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import useCustomerStore from "../store/customerStore";


const RequestRefund = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const bookingDetails =
    useCustomerStore(
      (state) =>
        state.bookingDetails
    );

  const unit =
    useCustomerStore(
      (state) => state.unit
    );

  const business =
    useCustomerStore(
      (state) => state.business
    );

  const getBookingById =
    useCustomerStore(
      (state) =>
        state.getBookingById
    );

  const getUnitById =
    useCustomerStore(
      (state) =>
        state.getUnitById
    );

  const getBusinessById =
    useCustomerStore(
      (state) =>
        state.getBusinessById
    );

  const requestRefund =
    useCustomerStore(
      (state) =>
        state.requestRefund
    );

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");


  /* =========================
     LOAD BOOKING
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setPageError("");

        const booking =
          await getBookingById(id);

        const unitId =
          getId(
            booking.unitId
          );

        const businessId =
          getId(
            booking.businessId
          );

        await Promise.all([
          unitId &&
          typeof booking.unitId !==
            "object"
            ? getUnitById(unitId)
            : Promise.resolve(),

          businessId &&
          typeof booking.businessId !==
            "object"
            ? getBusinessById(
                businessId
              )
            : Promise.resolve(),
        ]);
      } catch (error) {
        const message =
          error.response?.data
            ?.message ||
          "Unable to load booking";

        setPageError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    id,
    getBookingById,
    getUnitById,
    getBusinessById,
  ]);


  /* =========================
     REAL RELATED DATA
  ========================= */

  const booking =
    bookingDetails;

  const bookingUnit =
    booking &&
    typeof booking.unitId ===
      "object"
      ? booking.unitId
      : unit;

  const bookingBusiness =
    booking &&
    typeof booking.businessId ===
      "object"
      ? booking.businessId
      : business;


  /* =========================
     REFUND ELIGIBILITY
  ========================= */

  const canRequestRefund = () => {
    if (!booking) {
      return false;
    }

    const startDate =
      new Date(
        booking.startDate
      );

    const now =
      new Date();

    return (
      booking.isValid === true &&
      booking.paymentStatus ===
        "paid" &&
      booking.status ===
        "progress" &&
      startDate > now
    );
  };


  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const trimmedReason =
        reason.trim();

      if (!trimmedReason) {
        toast.error(
          "Please provide a refund reason"
        );

        return;
      }

      if (
        trimmedReason.length < 10
      ) {
        toast.error(
          "Please provide a little more detail"
        );

        return;
      }

      if (!canRequestRefund()) {
        toast.error(
          "This booking is not eligible for a refund request"
        );

        return;
      }

      const unitId =
        getId(
          booking.unitId
        );

      if (!unitId) {
        toast.error(
          "Booking unit could not be found"
        );

        return;
      }

      try {
        setSubmitting(true);

        const refund =
          await requestRefund({
            bookingId:
              booking._id,

            unitId,

            reason:
              trimmedReason,
          });

        toast.success(
          "Refund request submitted"
        );

        navigate(
          `/refunds/${refund._id}`
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to submit refund request"
        );
      } finally {
        setSubmitting(false);
      }
    };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-background">

        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <LoaderCircle
              size={38}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-text-secondary">
              Loading booking...
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (
    pageError ||
    !booking
  ) {
    return (
      <div className="min-h-screen bg-background">

        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-5">

          <div className="max-w-md text-center">

            <h1 className="text-2xl font-bold text-secondary">
              Booking not found
            </h1>

            <p className="mt-3 text-text-secondary">
              {pageError ||
                "Unable to load this booking."}
            </p>

            <Link
              to="/bookings"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              My Bookings
            </Link>

          </div>

        </div>

      </div>
    );
  }


  const eligible =
    canRequestRefund();

  const price =
    Number(
      booking.price || 0
    );

  const image =
    bookingUnit?.images?.[0]
      ?.url;


  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />


      <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-8">

        {/* =====================
            BACK
        ===================== */}

        <Link
          to={`/bookings/${booking._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft size={18} />

          Back to Booking
        </Link>


        {/* =====================
            HEADER
        ===================== */}

        <div className="mt-8 max-w-2xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Refund Request
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-secondary">
            Request a refund
          </h1>

          <p className="mt-4 leading-7 text-text-secondary">
            Submit a refund request
            for this booking. The
            administration will review
            your request before its
            status is updated.
          </p>

        </div>


        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* =====================
              LEFT
          ===================== */}

          <div className="space-y-6">

            {/* BOOKING */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white">

              <div className="grid sm:grid-cols-[210px_1fr]">

                <div className="h-56 bg-surface-soft sm:h-full">

                  {image ? (
                    <img
                      src={image}
                      alt={
                        bookingUnit?.title ||
                        "Booking unit"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-muted">
                      No image
                    </div>
                  )}

                </div>


                <div className="p-6">

                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Booking #
                    {booking.code}
                  </p>

                  <h2 className="mt-3 text-xl font-bold text-secondary">
                    {bookingUnit?.title ||
                      "Booked Unit"}
                  </h2>

                  {bookingBusiness && (
                    <p className="mt-2 font-medium text-text-secondary">
                      {
                        bookingBusiness.name
                      }
                    </p>
                  )}

                  {(bookingBusiness?.address ||
                    bookingBusiness?.city) && (
                    <div className="mt-4 flex items-start gap-2 text-sm text-text-secondary">

                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        {[
                          bookingBusiness?.address,
                          bookingBusiness?.city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>

                    </div>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <DateItem
                      label="Start Date"
                      date={
                        booking.startDate
                      }
                    />

                    <DateItem
                      label="End Date"
                      date={
                        booking.endDate
                      }
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* NOT ELIGIBLE */}

            {!eligible && (
              <section className="rounded-2xl border border-red-200 bg-red-50 p-5">

                <h2 className="font-bold text-red-800">
                  Refund request unavailable
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  Refund requests are
                  only available for
                  confirmed, paid,
                  upcoming bookings.
                </p>

              </section>
            )}


            {/* =====================
                FORM
            ===================== */}

            <form
              onSubmit={
                handleSubmit
              }
              className="rounded-2xl border border-border bg-white p-6"
            >

              <h2 className="text-xl font-bold text-secondary">
                Why are you requesting
                a refund?
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Give a short
                explanation so the
                administration can
                review your request.
              </p>


              <div className="mt-6">

                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-semibold text-secondary"
                >
                  Refund reason
                </label>

                <textarea
                  id="reason"
                  rows={6}
                  maxLength={500}
                  disabled={
                    !eligible ||
                    submitting
                  }
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="Example: My travel plans changed and I can no longer use this booking."
                  className="w-full resize-none rounded-xl border border-border bg-white p-4 text-sm text-secondary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-soft"
                />

                <div className="mt-2 flex justify-between text-xs text-text-muted">

                  <span>
                    Minimum 10 characters
                  </span>

                  <span>
                    {reason.length}/500
                  </span>

                </div>

              </div>


              {/* WARNING */}

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">

                <p className="font-semibold text-amber-800">
                  Before you continue
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-700">
                  Submitting a request
                  does not automatically
                  refund the payment.
                  The request will first
                  be reviewed by the
                  administration.
                </p>

              </div>


              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <Link
                  to={`/bookings/${booking._id}`}
                  className="rounded-xl border border-border px-6 py-3.5 text-center text-sm font-semibold text-secondary transition hover:bg-surface-soft"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !eligible ||
                    reason.trim().length <
                      10
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-danger px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300"
                >

                  {submitting && (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Submitting..."
                    : "Submit Refund Request"}

                </button>

              </div>

            </form>

          </div>


          {/* =====================
              RIGHT
          ===================== */}

          <aside>

            <div className="sticky top-28 space-y-5">


              {/* REFUND SUMMARY */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">

                    <ReceiptText
                      size={21}
                    />

                  </div>

                  <h2 className="font-bold text-secondary">
                    Refund Summary
                  </h2>

                </div>


                <div className="mt-6">

                  <p className="text-sm text-text-secondary">
                    Booking amount
                  </p>

                  <p className="mt-2 text-3xl font-bold text-secondary">
                    $
                    {price.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Paid booking total
                  </p>

                </div>


                <div className="mt-6 border-t border-border pt-5">

                  <SummaryRow
                    label="Booking"
                    value={
                      booking.code
                    }
                  />

                  <SummaryRow
                    label="Payment"
                    value={
                      booking.paymentStatus ===
                      "paid"
                        ? "Paid"
                        : "Unpaid"
                    }
                  />

                  <SummaryRow
                    label="Booking"
                    value={
                      booking.isValid
                        ? "Confirmed"
                        : "Not confirmed"
                    }
                  />

                </div>

              </section>


              {/* =====================
                  PROCESS
              ===================== */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <h2 className="font-bold text-secondary">
                  What happens next?
                </h2>

                <div className="mt-6 space-y-5">

                  <ProcessStep
                    number="1"
                    title="Request submitted"
                    text="Your refund request is created with pending status."
                  />

                  <ProcessStep
                    number="2"
                    title="Admin review"
                    text="The administration reviews your request."
                  />

                  <ProcessStep
                    number="3"
                    title="Decision"
                    text="Your request is either accepted or rejected."
                  />

                </div>

              </section>


              {/* SECURITY */}

              <div className="flex gap-3 rounded-xl bg-primary-light p-4">

                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>

                  <p className="text-sm font-semibold text-secondary">
                    Refund request
                    tracking
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    After submitting,
                    you can track the
                    request from My
                    Refunds.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


/* =================================
   DATE
================================= */

const DateItem = ({
  label,
  date,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-soft p-3">

      <CalendarDays
        size={18}
        className="text-primary"
      />

      <div>

        <p className="text-[11px] font-semibold uppercase text-text-muted">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-secondary">
          {formatDate(date)}
        </p>

      </div>

    </div>
  );
};


/* =================================
   SUMMARY
================================= */

const SummaryRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-3 py-2 text-sm">

    <span className="text-text-secondary">
      {label}
    </span>

    <span className="text-right font-semibold text-secondary">
      {value || "—"}
    </span>

  </div>
);


/* =================================
   PROCESS
================================= */

const ProcessStep = ({
  number,
  title,
  text,
}) => (
  <div className="flex gap-4">

    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
      {number}
    </div>

    <div>

      <p className="text-sm font-semibold text-secondary">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-text-secondary">
        {text}
      </p>

    </div>

  </div>
);


/* =================================
   HELPERS
================================= */

const getId = (value) => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
    "object"
  ) {
    return String(
      value._id || ""
    );
  }

  return String(value);
};


const formatDate = (
  date
) => {
  if (!date) {
    return "—";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};


export default RequestRefund;