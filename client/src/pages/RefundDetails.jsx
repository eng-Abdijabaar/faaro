import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  LoaderCircle,
  ReceiptText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import useCustomerStore from "../store/customerStore";


const RefundDetails = () => {
  const { id } =
    useParams();

  const refund =
    useCustomerStore(
      (state) => state.refund
    );

  const getRefundById =
    useCustomerStore(
      (state) =>
        state.getRefundById
    );

  const getBookingById =
    useCustomerStore(
      (state) =>
        state.getBookingById
    );

  const [
    booking,
    setBooking,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    pageError,
    setPageError,
  ] = useState("");


  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setPageError("");

        const refundData =
          await getRefundById(
            id
          );

        const bookingId =
          getId(
            refundData.bookingId
          );

        if (bookingId) {
          try {
            const bookingData =
              await getBookingById(
                bookingId
              );

            setBooking(
              bookingData
            );
          } catch {
            setBooking(null);
          }
        }
      } catch (error) {
        const message =
          error.response?.data
            ?.message ||
          "Unable to load refund";

        setPageError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    id,
    getRefundById,
    getBookingById,
  ]);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-background">

          <div className="text-center">

            <LoaderCircle
              size={38}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-text-secondary">
              Loading refund...
            </p>

          </div>

        </div>
      </>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (
    pageError ||
    !refund
  ) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">

          <div className="max-w-md text-center">

            <XCircle
              size={42}
              className="mx-auto text-danger"
            />

            <h1 className="mt-5 text-2xl font-bold text-secondary">
              Refund not found
            </h1>

            <p className="mt-3 text-text-secondary">
              {pageError ||
                "Unable to find this refund request."}
            </p>

            <Link
              to="/refunds"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              My Refunds
            </Link>

          </div>

        </div>
      </>
    );
  }


  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />

      <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-8">

        {/* =====================
            BACK
        ===================== */}

        <Link
          to="/refunds"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft size={18} />

          Back to Refunds
        </Link>


        {/* =====================
            HEADER
        ===================== */}

        <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Refund Request
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
              Refund Details
            </h1>

            <p className="mt-3 text-sm text-text-muted">
              Request #
              {String(
                refund._id
              ).slice(-10)}
            </p>

          </div>

          <RefundStatus
            status={
              refund.status
            }
          />

        </div>


        {/* =====================
            STATUS MESSAGE
        ===================== */}

        <StatusMessage
          status={
            refund.status
          }
        />


        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">

          {/* ===================
              LEFT
          =================== */}

          <div className="space-y-6">

            {/* REQUEST */}

            <section className="rounded-2xl border border-border bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">

                  <FileText
                    size={21}
                  />

                </div>

                <div>

                  <h2 className="font-bold text-secondary">
                    Refund Reason
                  </h2>

                  <p className="text-xs text-text-muted">
                    Submitted{" "}
                    {formatDate(
                      refund.createdAt
                    )}
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl bg-surface-soft p-5">

                <p className="leading-7 text-text-secondary">
                  {refund.reason}
                </p>

              </div>

            </section>


            {/* BOOKING */}

            <section className="rounded-2xl border border-border bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">

                  <ReceiptText
                    size={21}
                  />

                </div>

                <h2 className="font-bold text-secondary">
                  Booking Information
                </h2>

              </div>

              <div className="mt-6 divide-y divide-border">

                <DetailRow
                  label="Booking"
                  value={
                    booking?.code ||
                    shortId(
                      refund.bookingId
                    )
                  }
                />

                <DetailRow
                  label="Booking ID"
                  value={
                    getId(
                      refund.bookingId
                    )
                  }
                />

                <DetailRow
                  label="Unit ID"
                  value={
                    getId(
                      refund.unitId
                    )
                  }
                />

                {booking && (
                  <>
                    <DetailRow
                      label="Start Date"
                      value={formatDate(
                        booking.startDate
                      )}
                    />

                    <DetailRow
                      label="End Date"
                      value={formatDate(
                        booking.endDate
                      )}
                    />

                    <DetailRow
                      label="Booking Status"
                      value={
                        booking.status
                      }
                    />

                    <DetailRow
                      label="Valid Booking"
                      value={
                        booking.isValid
                          ? "Yes"
                          : "No"
                      }
                    />
                  </>
                )}

              </div>

            </section>


            {/* PAYMENT */}

            {booking && (
              <section className="rounded-2xl border border-border bg-white p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">

                    <CreditCard
                      size={21}
                    />

                  </div>

                  <h2 className="font-bold text-secondary">
                    Payment Information
                  </h2>

                </div>

                <div className="mt-6 divide-y divide-border">

                  <DetailRow
                    label="Payment Status"
                    value={
                      booking.paymentStatus ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Booking Amount"
                    value={
                      booking.price != null
                        ? `$${Number(
                            booking.price
                          ).toFixed(
                            2
                          )}`
                        : "—"
                    }
                  />

                </div>

              </section>
            )}

          </div>


          {/* ===================
              RIGHT
          =================== */}

          <aside>

            <div className="sticky top-28 space-y-5">

              {/* SUMMARY */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <h2 className="font-bold text-secondary">
                  Request Summary
                </h2>

                <div className="mt-5 divide-y divide-border">

                  <SummaryRow
                    label="Status"
                    value={formatStatus(
                      refund.status
                    )}
                  />

                  <SummaryRow
                    label="Requested"
                    value={formatDate(
                      refund.createdAt
                    )}
                  />

                  <SummaryRow
                    label="Last Updated"
                    value={formatDate(
                      refund.updatedAt
                    )}
                  />

                  {booking?.price != null && (
                    <SummaryRow
                      label="Booking Amount"
                      value={`$${Number(
                        booking.price
                      ).toFixed(2)}`}
                    />
                  )}

                </div>

              </section>


              {/* PROCESS */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <h2 className="font-bold text-secondary">
                  Refund Process
                </h2>

                <div className="mt-6 space-y-5">

                  <ProcessStep
                    number="1"
                    title="Request submitted"
                    active
                  />

                  <ProcessStep
                    number="2"
                    title="Admin review"
                    active={
                      refund.status !==
                      "pending"
                    }
                  />

                  <ProcessStep
                    number="3"
                    title={
                      refund.status ===
                      "accepted"
                        ? "Request accepted"
                        : refund.status ===
                            "rejected"
                          ? "Request rejected"
                          : "Decision pending"
                    }
                    active={
                      refund.status !==
                      "pending"
                    }
                  />

                </div>

              </section>


              <div className="flex gap-3 rounded-xl bg-primary-light p-4">

                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <p className="text-xs leading-5 text-text-secondary">
                  Refund requests are
                  reviewed by the
                  Faaro administration
                  before their status
                  is updated.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


/* =================================
   STATUS MESSAGE
================================= */

const StatusMessage = ({
  status,
}) => {
  const config = {
    pending: {
      icon: (
        <Clock3 size={22} />
      ),

      title:
        "Your request is under review",

      text:
        "The admin has not made a decision on this refund request yet.",

      className:
        "border-amber-200 bg-amber-50 text-amber-800",
    },

    accepted: {
      icon: (
        <CheckCircle2
          size={22}
        />
      ),

      title:
        "Your refund request was accepted",

      text:
        "The administration has accepted this refund request.",

      className:
        "border-green-200 bg-green-50 text-green-800",
    },

    rejected: {
      icon: (
        <XCircle size={22} />
      ),

      title:
        "Your refund request was rejected",

      text:
        "The administration has rejected this refund request.",

      className:
        "border-red-200 bg-red-50 text-red-800",
    },
  };

  const item =
    config[status] ||
    config.pending;

  return (
    <div
      className={`mt-7 flex items-start gap-4 rounded-2xl border p-5 ${item.className}`}
    >

      <div className="shrink-0">
        {item.icon}
      </div>

      <div>

        <h2 className="font-bold">
          {item.title}
        </h2>

        <p className="mt-1 text-sm leading-6 opacity-80">
          {item.text}
        </p>

      </div>

    </div>
  );
};


/* =================================
   STATUS BADGE
================================= */

const RefundStatus = ({
  status,
}) => {
  const styles = {
    pending:
      "bg-amber-50 text-amber-700",

    accepted:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",
  };

  const icons = {
    pending: (
      <Clock3 size={15} />
    ),

    accepted: (
      <CheckCircle2
        size={15}
      />
    ),

    rejected: (
      <XCircle size={15} />
    ),
  };

  return (
    <span
      className={`inline-flex h-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        styles[status] ||
        styles.pending
      }`}
    >
      {icons[status] ||
        icons.pending}

      {formatStatus(status)}
    </span>
  );
};


/* =================================
   ROWS
================================= */

const DetailRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-5 py-4 text-sm">

    <span className="text-text-muted">
      {label}
    </span>

    <span className="max-w-[65%] break-all text-right font-semibold capitalize text-secondary">
      {value || "—"}
    </span>

  </div>
);


const SummaryRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4 py-3 text-sm">

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
  active,
}) => (
  <div className="flex items-center gap-3">

    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        active
          ? "bg-primary text-white"
          : "bg-surface-soft text-text-muted"
      }`}
    >
      {number}
    </div>

    <p
      className={`text-sm font-semibold ${
        active
          ? "text-secondary"
          : "text-text-muted"
      }`}
    >
      {title}
    </p>

  </div>
);


/* =================================
   HELPERS
================================= */

const getId = (value) => {
  if (!value) return "";

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


const shortId = (value) => {
  const id = getId(value);

  return id
    ? `...${id.slice(-8)}`
    : "—";
};


const formatStatus = (
  value
) => {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
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


export default RefundDetails;