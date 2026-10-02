import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  CreditCard,
  Hotel,
  ImageOff,
  LoaderCircle,
  MapPin,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import useCustomerStore from "../store/customerStore";
import usePaymentStore from "../store/paymentStore";

const BookingDetails = () => {
  const { id } = useParams();

  const [pageLoading, setPageLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [paying, setPaying] =
    useState(false);

  const booking = useCustomerStore(
    (state) =>
      state.bookingDetails
  );

  const unit = useCustomerStore(
    (state) => state.unit
  );

  const business = useCustomerStore(
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

  const createCheckoutSession =
    usePaymentStore(
      (state) =>
        state.createCheckoutSession
    );

  /* LOAD */

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        setPageError("");

        const bookingData =
          await getBookingById(id);

        const unitId =
          typeof bookingData.unitId ===
          "object"
            ? bookingData.unitId._id
            : bookingData.unitId;

        const businessId =
          typeof bookingData.businessId ===
          "object"
            ? bookingData.businessId._id
            : bookingData.businessId;

        await Promise.all([
          getUnitById(unitId),
          getBusinessById(
            businessId
          ),
        ]);
      } catch (error) {
        setPageError(
          error.response?.data?.message ||
            "Unable to load booking"
        );
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [
    id,
    getBookingById,
    getUnitById,
    getBusinessById,
  ]);

  const duration = useMemo(() => {
    if (!booking) return 0;

    const start =
      new Date(
        booking.startDate
      );

    const end =
      new Date(
        booking.endDate
      );

    const days =
      (end - start) /
      (1000 * 60 * 60 * 24);

    return days > 0
      ? days
      : 0;
  }, [booking]);

  const handlePayment = async () => {
    try {
      setPaying(true);

      const checkout =
        await createCheckoutSession(
          booking._id
        );

      window.location.assign(
        checkout.checkoutUrl
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to start payment"
      );

      setPaying(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">

          <LoaderCircle
            size={40}
            className="animate-spin text-primary"
          />

        </div>
      </>
    );
  }

  if (
    pageError ||
    !booking ||
    !unit ||
    !business
  ) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center text-center">

          <div>

            <h1 className="text-2xl font-bold text-secondary">
              Booking not available
            </h1>

            <p className="mt-3 text-text-secondary">
              {pageError}
            </p>

            <Link
              to="/bookings"
              className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              My Bookings
            </Link>

          </div>

        </div>
      </>
    );
  }

  const category =
    business.category;

  const status =
    getBookingStatus(booking);

  const unitId =
    typeof booking.unitId ===
    "object"
      ? booking.unitId._id
      : booking.unitId;

  const image =
    unit.images?.[0]?.url ||
    null;

  const unitPrice =
    Number(unit.price || 0);

  /*
    booking.price is the amount
    Stripe charges.
  */

  const totalPrice =
    Number(
      booking.price ??
        unitPrice * duration
    );

  const period =
    category === "car_rental"
      ? "day"
      : "night";

  const canPay =
    !booking.isValid &&
    booking.paymentStatus !== "paid";

  const canRefund =
    status.key === "upcoming" &&
    booking.isValid &&
    booking.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />

      <main className="mx-auto max-w-[1200px] px-5 py-9 md:px-8">

        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={18} />

          Back to My Bookings
        </Link>

        {/* HEADER */}

        <div className="mt-7 flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">

          <div>

            <div className="mb-3 flex flex-wrap items-center gap-3">

              <BookingStatus
                status={status}
              />

              {booking.code && (
                <span className="text-sm text-text-muted">
                  Booking #
                  {booking.code}
                </span>
              )}

            </div>

            <h1 className="text-3xl font-bold text-secondary md:text-4xl">
              Booking Details
            </h1>

          </div>

          <div className="rounded-xl bg-surface-soft px-4 py-3">

            <p className="text-xs text-text-muted">
              Booked on
            </p>

            <p className="mt-1 font-semibold text-secondary">
              {formatDate(
                booking.createdAt
              )}
            </p>

          </div>

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* UNIT */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white">

              <div className="grid sm:grid-cols-[220px_1fr]">

                <Link
                  to={`/unit/${unitId}`}
                  className="h-52 bg-surface-soft"
                >

                  {image ? (
                    <img
                      src={image}
                      alt={unit.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-muted">
                      <ImageOff size={30} />
                    </div>
                  )}

                </Link>

                <div className="p-6">

                  <CategoryBadge
                    category={category}
                  />

                  <h2 className="mt-4 text-2xl font-bold text-secondary">
                    {unit.title}
                  </h2>

                  <p className="mt-2 text-text-secondary">
                    {business.name}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">

                    <MapPin size={16} />

                    {unit.address ||
                      business.address}

                  </div>

                </div>

              </div>

            </section>

            {/* BOOKING INFO */}

            <section className="rounded-2xl border border-border bg-white p-6">

              <h2 className="text-xl font-bold text-secondary">
                Booking Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <InfoBox
                  icon={
                    <CalendarDays />
                  }
                  label={
                    category ===
                    "car_rental"
                      ? "Pickup"
                      : "Check-in"
                  }
                  value={formatDate(
                    booking.startDate
                  )}
                />

                <InfoBox
                  icon={
                    <CalendarDays />
                  }
                  label={
                    category ===
                    "car_rental"
                      ? "Return"
                      : "Check-out"
                  }
                  value={formatDate(
                    booking.endDate
                  )}
                />

              </div>

              <div className="mt-4 rounded-xl bg-surface-soft p-4">

                <Clock3
                  size={19}
                  className="inline text-primary"
                />

                <span className="ml-3 text-sm text-text-secondary">
                  {duration}{" "}
                  {duration === 1
                    ? period
                    : `${period}s`}
                </span>

              </div>

            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-border bg-white p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold text-secondary">
                  Payment Information
                </h2>

                <CreditCard
                  className="text-primary"
                />

              </div>

              <div className="mt-6 divide-y divide-border">

                <DetailRow
                  label="Payment status"
                  value={
                    booking.paymentStatus ===
                    "paid"
                      ? "Paid"
                      : "Unpaid"
                  }
                />

                <DetailRow
                  label="Booking validity"
                  value={
                    booking.isValid
                      ? "Valid"
                      : "Not confirmed"
                  }
                />

              </div>

              {booking.isValid ? (
                <div className="mt-6 flex gap-3 rounded-xl bg-green-50 p-4">

                  <ShieldCheck
                    className="text-success"
                  />

                  <p className="text-sm text-text-secondary">
                    Payment confirmed
                    and booking valid.
                  </p>

                </div>
              ) : booking.paymentStatus ===
                "paid" ? (
                <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 p-4">

                  <Clock3
                    className="text-warning"
                  />

                  <p className="text-sm text-text-secondary">
                    Payment received.
                    Booking confirmation
                    is being finalized.
                  </p>

                </div>
              ) : null}

            </section>

            {/* BUSINESS */}

            <section className="rounded-2xl border border-border bg-white p-6">

              <h2 className="text-xl font-bold text-secondary">
                Business Information
              </h2>

              <div className="mt-6 flex gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <Building2 />
                </div>

                <div>

                  <h3 className="font-bold text-secondary">
                    {business.name}
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary">
                    {business.city}
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* SIDEBAR */}

          <aside>

            <div className="sticky top-28 space-y-5">

              <section className="rounded-2xl border border-border bg-white p-6">

                <div className="flex items-center gap-3">

                  <ReceiptText
                    className="text-primary"
                  />

                  <h2 className="text-xl font-bold text-secondary">
                    Price Summary
                  </h2>

                </div>

                <div className="mt-6">

                  <div className="flex justify-between text-sm text-text-secondary">

                    <span>
                      ${unitPrice} ×{" "}
                      {duration}
                    </span>

                    <span>
                      ${totalPrice}
                    </span>

                  </div>

                  <div className="mt-5 flex justify-between border-t border-border pt-5 text-lg font-bold text-secondary">

                    <span>Total</span>

                    <span>
                      ${totalPrice}
                    </span>

                  </div>

                </div>

              </section>

              {/* STATUS */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <h2 className="font-bold text-secondary">
                  Booking Status
                </h2>

                <div className="mt-5">
                  <BookingStatus
                    status={status}
                  />
                </div>

              </section>

              {/* ACTIONS */}

              <section className="rounded-2xl border border-border bg-white p-6">

                <h2 className="font-bold text-secondary">
                  Actions
                </h2>

                <div className="mt-5 space-y-3">

                  {canPay && (
                    <button
                      type="button"
                      onClick={
                        handlePayment
                      }
                      disabled={paying}
                      className="w-full rounded-xl bg-warning py-3.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {paying
                        ? "Opening payment..."
                        : "Complete Payment"}
                    </button>
                  )}

                  <Link
                    to={`/unit/${unitId}`}
                    className="block rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-white"
                  >
                    View Unit
                  </Link>

                  {canRefund && (
                    <Link
                      to={`/bookings/${booking._id}/refund`}
                      className="block rounded-xl border border-danger/30 py-3.5 text-center text-sm font-semibold text-danger"
                    >
                      Request Refund
                    </Link>
                  )}

                </div>

              </section>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

/* HELPERS */

const getBookingStatus = (
  booking
) => {
  if (
    booking.status === "cancelled"
  ) {
    return {
      key: "cancelled",
      label: "Cancelled",
    };
  }

  if (
    booking.status === "expired"
  ) {
    return {
      key: "expired",
      label: "Expired",
    };
  }

  if (!booking.isValid) {
    return {
      key: "pending",
      label:
        booking.paymentStatus === "paid"
          ? "Confirming Booking"
          : "Payment Pending",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start =
    new Date(booking.startDate);

  const end =
    new Date(booking.endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today < start) {
    return {
      key: "upcoming",
      label: "Upcoming",
    };
  }

  if (
    today >= start &&
    today < end
  ) {
    return {
      key: "active",
      label: "Active",
    };
  }

  return {
    key: "completed",
    label: "Completed",
  };
};

const BookingStatus = ({
  status,
}) => {
  const styles = {
    pending:
      "bg-amber-50 text-amber-700",
    upcoming:
      "bg-blue-50 text-blue-700",
    active:
      "bg-green-50 text-green-700",
    completed:
      "bg-slate-100 text-slate-600",
    cancelled:
      "bg-red-50 text-red-700",
    expired:
      "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status.key]
      }`}
    >
      {status.label}
    </span>
  );
};

const CategoryBadge = ({
  category,
}) => {
  const config = {
    hotel: {
      label: "Hotel",
      icon: <Hotel size={14} />,
    },
    car_rental: {
      label: "Car Rental",
      icon: <Car size={14} />,
    },
    apartment: {
      label: "Apartment",
      icon: (
        <Building2 size={14} />
      ),
    },
  };

  const item = config[category];

  if (!item) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
      {item.icon}
      {item.label}
    </span>
  );
};

const InfoBox = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-border p-4">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
      {icon}
    </div>

    <div>
      <p className="text-xs text-text-muted">
        {label}
      </p>

      <p className="font-semibold text-secondary">
        {value}
      </p>
    </div>

  </div>
);

const DetailRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4 py-4 text-sm">

    <span className="text-text-secondary">
      {label}
    </span>

    <span className="font-semibold text-secondary">
      {value}
    </span>

  </div>
);

const formatDate = (date) => {
  if (!date) return "—";

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

export default BookingDetails;