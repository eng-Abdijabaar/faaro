import { useEffect, useMemo, useState, } from "react";

import { Link, useNavigate } from "react-router";

import { ArrowRight, Building2, CalendarDays, Car, CheckCircle2, Clock3, Hotel, ImageOff, LoaderCircle, MapPin, Search, WalletCards, } from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import useCustomerStore from "../store/customerStore";
import usePaymentStore from "../store/paymentStore";

const Bookings = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] =
    useState("all");

  const [pageLoading, setPageLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [
    payingBookingId,
    setPayingBookingId,
  ] = useState(null);

  /* STORE */

  const bookings = useCustomerStore(
    (state) => state.bookings
  );

  const units = useCustomerStore(
    (state) => state.units
  );

  const businesses = useCustomerStore(
    (state) => state.businesses
  );

  const getBookings = useCustomerStore(
    (state) => state.getBookings
  );

  const getUnits = useCustomerStore(
    (state) => state.getUnits
  );

  const getBusinesses =
    useCustomerStore(
      (state) => state.getBusinesses
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

        await Promise.all([
          getBookings(),
          getUnits(),
          getBusinesses(),
        ]);
      } catch (error) {
        setPageError(
          error.response?.data?.message ||
            "Unable to load bookings"
        );
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [
    getBookings,
    getUnits,
    getBusinesses,
  ]);

  const unitMap = useMemo(
    () =>
      new Map(
        units.map((unit) => [
          String(unit._id),
          unit,
        ])
      ),
    [units]
  );

  const businessMap = useMemo(
    () =>
      new Map(
        businesses.map((business) => [
          String(business._id),
          business,
        ])
      ),
    [businesses]
  );

  const bookingItems = useMemo(
    () =>
      bookings.map((booking) => {
        const unit =
          typeof booking.unitId ===
          "object"
            ? booking.unitId
            : unitMap.get(
                String(booking.unitId)
              );

        const business =
          typeof booking.businessId ===
          "object"
            ? booking.businessId
            : businessMap.get(
                String(
                  booking.businessId
                )
              );

        const duration =
          calculateDuration(
            booking.startDate,
            booking.endDate
          );

        const unitPrice =
          Number(unit?.price || 0);

        /*
          booking.price = final booking
          total used by Stripe.
        */

        const totalPrice =
          Number(
            booking.price ??
              unitPrice * duration
          );

        return {
          ...booking,

          unit,
          business,

          category:
            business?.category || "",

          unitTitle:
            unit?.title ||
            "Unit unavailable",

          businessName:
            business?.name ||
            "Business unavailable",

          city:
            business?.city || "",

          image:
            unit?.images?.[0]?.url ||
            null,

          unitPrice,
          totalPrice,
        };
      }),
    [
      bookings,
      unitMap,
      businessMap,
    ]
  );

  const counts = useMemo(() => {
    const values = {
      all: bookingItems.length,
      pending: 0,
      upcoming: 0,
      active: 0,
      completed: 0,
    };

    bookingItems.forEach((booking) => {
      const status =
        getBookingStatus(booking);

      if (
        values[status.key] !== undefined
      ) {
        values[status.key]++;
      }
    });

    return values;
  }, [bookingItems]);

  const filteredBookings =
    useMemo(() => {
      if (activeTab === "all")
        return bookingItems;

      return bookingItems.filter(
        (booking) =>
          getBookingStatus(
            booking
          ).key === activeTab
      );
    }, [
      activeTab,
      bookingItems,
    ]);

  /* COMPLETE PAYMENT */

  const handlePayment = async (
    bookingId
  ) => {
    try {
      setPayingBookingId(
        bookingId
      );

      const checkout =
        await createCheckoutSession(
          bookingId
        );

      window.location.assign(
        checkout.checkoutUrl
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to start payment"
      );

      setPayingBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Your trips
          </p>

          <h1 className="mt-3 text-4xl font-bold text-secondary md:text-5xl">
            My Bookings
          </h1>

          <p className="mt-4 text-text-secondary">
            Manage your bookings,
            payments and upcoming trips.
          </p>

        </div>

      </section>

      <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">

        {pageLoading ? (
          <LoadingState />
        ) : pageError ? (
          <ErrorState
            message={pageError}
          />
        ) : (
          <>
            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <SummaryCard
                label="Total Bookings"
                value={counts.all}
                icon={<CalendarDays />}
              />

              <SummaryCard
                label="Pending Payment"
                value={counts.pending}
                icon={<WalletCards />}
              />

              <SummaryCard
                label="Upcoming"
                value={counts.upcoming}
                icon={<Clock3 />}
              />

              <SummaryCard
                label="Completed"
                value={counts.completed}
                icon={
                  <CheckCircle2 />
                }
              />

            </div>

            {/* TABS */}

            <div className="mt-10 flex gap-2 overflow-x-auto border-b border-border pb-4">

              {[
                ["all", "All"],
                ["pending", "Pending"],
                ["upcoming", "Upcoming"],
                ["active", "Active"],
                ["completed", "Completed"],
              ].map(
                ([key, label]) => (
                  <TabButton
                    key={key}
                    active={
                      activeTab === key
                    }
                    label={label}
                    count={counts[key]}
                    onClick={() =>
                      setActiveTab(key)
                    }
                  />
                )
              )}

            </div>

            {/* BOOKINGS */}

            <section className="mt-8">

              {filteredBookings.length ? (
                <div className="space-y-5">

                  {filteredBookings.map(
                    (booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onPayment={
                          handlePayment
                        }
                        paying={
                          payingBookingId ===
                          booking._id
                        }
                      />
                    )
                  )}

                </div>
              ) : (
                <EmptyBookings
                  activeTab={
                    activeTab
                  }
                />
              )}

            </section>
          </>
        )}

      </main>

    </div>
  );
};

const BookingCard = ({
  booking,
  onPayment,
  paying,
}) => {
  const status =
    getBookingStatus(booking);

  const unitId =
    typeof booking.unitId === "object"
      ? booking.unitId?._id
      : booking.unitId;

  const period =
    booking.category ===
    "car_rental"
      ? "day"
      : "night";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white hover:shadow-md">

      <div className="grid md:grid-cols-[250px_1fr]">

        <Link
          to={`/unit/${unitId}`}
          className="relative h-56 overflow-hidden bg-surface-soft md:h-full"
        >

          {booking.image ? (
            <img
              src={booking.image}
              alt={booking.unitTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-56 items-center justify-center text-text-muted">
              <ImageOff size={30} />
            </div>
          )}

          {booking.category && (
            <div className="absolute left-4 top-4">
              <CategoryBadge
                category={
                  booking.category
                }
              />
            </div>
          )}

        </Link>

        <div className="p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-5 sm:flex-row">

            <div>

              <div className="mb-2 flex flex-wrap items-center gap-2">

                <BookingStatus
                  status={status}
                />

                {booking.code && (
                  <span className="text-xs text-text-muted">
                    Booking #
                    {booking.code}
                  </span>
                )}

              </div>

              <Link
                to={`/unit/${unitId}`}
              >
                <h2 className="text-xl font-bold text-secondary hover:text-primary">
                  {booking.unitTitle}
                </h2>
              </Link>

              <p className="mt-1 text-sm font-medium text-text-secondary">
                {booking.businessName}
              </p>

              {booking.city && (
                <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={15} />
                  {booking.city}
                </div>
              )}

            </div>

            <div className="sm:text-right">

              <p className="text-xs text-text-muted">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold text-secondary">
                ${booking.totalPrice}
              </p>

              <p className="text-xs text-text-muted">
                ${booking.unitPrice} /{" "}
                {period}
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-3 rounded-xl bg-surface-soft p-4 sm:grid-cols-2">

            <DateItem
              title={
                booking.category ===
                "car_rental"
                  ? "Pickup"
                  : "Check-in"
              }
              date={
                booking.startDate
              }
            />

            <DateItem
              title={
                booking.category ===
                "car_rental"
                  ? "Return"
                  : "Check-out"
              }
              date={
                booking.endDate
              }
            />

          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">

            <div>

              <p className="text-xs text-text-muted">
                Payment
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  booking.paymentStatus ===
                  "paid"
                    ? "text-success"
                    : "text-warning"
                }`}
              >
                {booking.paymentStatus ===
                "paid"
                  ? "Paid"
                  : "Unpaid"}
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {!booking.isValid &&
                booking.paymentStatus !==
                  "paid" && (
                  <button
                    type="button"
                    onClick={() =>
                      onPayment(
                        booking._id
                      )
                    }
                    disabled={paying}
                    className="rounded-xl bg-warning px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {paying
                      ? "Opening payment..."
                      : "Complete Payment"}
                  </button>
                )}

              <Link
                to={`/bookings/${booking._id}`}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                View Booking

                <ArrowRight
                  size={16}
                />
              </Link>

            </div>

          </div>

        </div>

      </div>

    </article>
  );
};

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
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status.key] ||
        styles.completed
      }`}
    >
      {status.label}
    </span>
  );
};

const SummaryCard = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-border bg-white p-5">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-text-secondary">
          {label}
        </p>

        <p className="mt-2 text-3xl font-bold text-secondary">
          {value}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

    </div>

  </div>
);

const TabButton = ({
  active,
  label,
  count,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
      active
        ? "bg-primary text-white"
        : "bg-white text-text-secondary"
    }`}
  >
    {label}

    <span>
      {count}
    </span>
  </button>
);

const CategoryBadge = ({
  category,
}) => {
  const config = {
    hotel: {
      label: "Hotel",
      icon: <Hotel size={14} />,
    },
    car_rental: {
      label: "Car",
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
    <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow">
      {item.icon}
      {item.label}
    </span>
  );
};

const DateItem = ({
  title,
  date,
}) => (
  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
      <CalendarDays size={18} />
    </div>

    <div>
      <p className="text-xs text-text-muted">
        {title}
      </p>

      <p className="font-semibold text-secondary">
        {formatDate(date)}
      </p>
    </div>

  </div>
);

const LoadingState = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <LoaderCircle
      size={40}
      className="animate-spin text-primary"
    />
  </div>
);

const ErrorState = ({
  message,
}) => (
  <div className="rounded-2xl border border-border bg-white p-10 text-center">

    <h2 className="text-2xl font-bold text-secondary">
      Unable to load bookings
    </h2>

    <p className="mt-3 text-text-secondary">
      {message}
    </p>

  </div>
);

const EmptyBookings = ({
  activeTab,
}) => (
  <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-10 text-center">

    <Search
      size={35}
      className="text-primary"
    />

    <h2 className="mt-5 text-2xl font-bold text-secondary">
      No bookings found
    </h2>

    <p className="mt-3 text-text-secondary">
      {activeTab === "all"
        ? "You haven't made any bookings yet."
        : `You don't have any ${activeTab} bookings.`}
    </p>

    <Link
      to="/explore"
      className="mt-7 rounded-xl bg-primary px-6 py-3 font-semibold text-white"
    >
      Explore Faaro
    </Link>

  </div>
);

const calculateDuration = (
  startDate,
  endDate
) => {
  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const days =
    (end - start) /
    (1000 * 60 * 60 * 24);

  return days > 0 ? days : 0;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

export default Bookings;