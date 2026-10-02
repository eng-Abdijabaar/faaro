import {
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  SearchCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import BusinessLayout from "../../components/business/BusinessLayout";
import useBusinessStore from "../../store/businessStore";

const CheckBooking = () => {
  const verifiedBooking =
    useBusinessStore(
      (state) =>
        state.verifiedBooking
    );

  const checkBooking =
    useBusinessStore(
      (state) =>
        state.checkBooking
    );

  const clearVerifiedBooking =
    useBusinessStore(
      (state) =>
        state.clearVerifiedBooking
    );

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const value =
        code.trim();

      if (!value) {
        toast.error(
          "Enter a booking code"
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        clearVerifiedBooking();

        await checkBooking(
          value
        );

        toast.success(
          "Booking verified successfully"
        );
      } catch (error) {
        const message =
          error.response?.data
            ?.message ||
          "Booking verification failed";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <BusinessLayout>

      <div className="mx-auto max-w-3xl">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">

            <SearchCheck
              size={30}
            />

          </div>

          <p className="mt-6 text-sm font-semibold text-primary">
            Booking Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-secondary">
            Check Booking
          </h1>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-text-secondary">
            Enter the booking code
            provided by the customer
            to verify that the
            reservation is valid for
            your business.
          </p>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-10 rounded-2xl border border-border bg-white p-6"
        >

          <label className="block">

            <span className="mb-2 block text-sm font-semibold text-secondary">
              Booking Code
            </span>

            <input
              value={code}
              onChange={(e) => {
                setCode(
                  e.target.value
                );

                setError("");
              }}
              placeholder="Paste booking code"
              className="w-full rounded-xl border border-border px-4 py-4 text-center text-lg font-semibold tracking-wide outline-none focus:border-primary"
            />

          </label>

          <button
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Checking..."
              : "Verify Booking"}
          </button>

        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-start gap-3">

              <XCircle className="shrink-0 text-danger" />

              <div>
                <h3 className="font-bold text-danger">
                  Booking not valid
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {verifiedBooking && (
          <ValidBooking
            booking={
              verifiedBooking
            }
          />
        )}

      </div>

    </BusinessLayout>
  );
};

const ValidBooking = ({
  booking,
}) => {
  const customer =
    booking.customerId;

  const unit =
    booking.unitId;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-green-200 bg-white">

      <div className="bg-green-50 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">

            <CheckCircle2
              size={27}
            />

          </div>

          <div>
            <h2 className="text-xl font-bold text-green-800">
              Valid Booking
            </h2>

            <p className="text-sm text-green-700">
              This reservation has
              been verified.
            </p>
          </div>

        </div>

      </div>

      <div className="p-6">

        <div className="rounded-xl bg-surface-soft p-4 text-center">

          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Booking Code
          </p>

          <p className="mt-2 break-all text-lg font-bold text-secondary">
            {booking.code}
          </p>

        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <InfoCard
            icon={
              <UserRound />
            }
            label="Customer"
            value={
              customer?.fullName
            }
          />

          <InfoCard
            icon={
              <CalendarDays />
            }
            label="Unit"
            value={
              unit?.title
            }
          />

        </div>

        <div className="mt-6 divide-y divide-border">

          <Row
            label="Customer Email"
            value={
              customer?.email
            }
          />

          <Row
            label="Customer Phone"
            value={
              customer?.phone
            }
          />

          <Row
            label="Unit Code"
            value={
              unit?.code
            }
          />

          <Row
            label="Start Date"
            value={formatDate(
              booking.startDate
            )}
          />

          <Row
            label="End Date"
            value={formatDate(
              booking.endDate
            )}
          />

          <Row
            label="Payment"
            value={
              booking.paymentStatus ||
              "paid"
            }
          />

        </div>

      </div>

    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-border p-4">

    <div className="text-primary">
      {icon}
    </div>

    <div>
      <p className="text-xs text-text-muted">
        {label}
      </p>

      <p className="mt-1 font-semibold text-secondary">
        {value || "—"}
      </p>
    </div>

  </div>
);

const Row = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-5 py-4 text-sm">

    <span className="text-text-muted">
      {label}
    </span>

    <span className="text-right font-semibold text-secondary">
      {value || "—"}
    </span>

  </div>
);

const formatDate = (
  date
) =>
  date
    ? new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

export default CheckBooking;