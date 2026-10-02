import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  DollarSign,
  Hotel,
  ImageOff,
  LoaderCircle,
  MapPin,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

import toast from "react-hot-toast";

import BusinessLayout from "../../components/business/BusinessLayout";
import useBusinessStore from "../../store/businessStore";
import useAuthStore from "../../store/authStore";

const BusinessDashboard = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const business = useBusinessStore(
    (state) => state.business
  );

  const units = useBusinessStore(
    (state) => state.units
  );

  const bookings = useBusinessStore(
    (state) => state.bookings
  );

  const verifiedBooking = useBusinessStore(
    (state) => state.verifiedBooking
  );

  const isLoading = useBusinessStore(
    (state) => state.isLoading
  );

  const error = useBusinessStore(
    (state) => state.error
  );

  const loadDashboard = useBusinessStore(
    (state) => state.loadDashboard
  );

  const checkBooking = useBusinessStore(
    (state) => state.checkBooking
  );

  const clearVerifiedBooking =
    useBusinessStore(
      (state) => state.clearVerifiedBooking
    );

  const [
    bookingCode,
    setBookingCode,
  ] = useState("");

  const [
    verifying,
    setVerifying,
  ] = useState(false);

  useEffect(() => {
    loadDashboard().catch(() => {});
  }, [loadDashboard]);

  const unitStats = useMemo(() => {
    return {
      total: units.length,

      active: units.filter(
        (unit) => unit.active
      ).length,

      inactive: units.filter(
        (unit) => !unit.active
      ).length,

      available: units.filter(
        (unit) =>
          unit.active &&
          unit.isAvailable
      ).length,
    };
  }, [units]);

  const bookingStats = useMemo(() => {
    const now = new Date();

    let upcoming = 0;
    let active = 0;
    let completed = 0;

    bookings.forEach((booking) => {
      const start = new Date(
        booking.startDate
      );

      const end = new Date(
        booking.endDate
      );

      if (now < start) {
        upcoming++;
      } else if (
        now >= start &&
        now < end
      ) {
        active++;
      } else {
        completed++;
      }
    });

    const revenue = bookings.reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.price || 0
        ),
      0
    );

    return {
      total: bookings.length,
      upcoming,
      active,
      completed,
      revenue,
    };
  }, [bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [bookings]);

  const handleVerify = async (e) => {
    e.preventDefault();

    const code =
      bookingCode.trim();

    if (!code) {
      toast.error(
        "Enter a booking code"
      );

      return;
    }

    try {
      setVerifying(true);

      clearVerifiedBooking();

      await checkBooking(code);

      toast.success(
        "Booking verified"
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Booking not found"
      );
    } finally {
      setVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <BusinessLayout>

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-text-secondary">
              Loading business...
            </p>

          </div>

        </div>

      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <p className="text-sm font-semibold text-primary">
            Business Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-secondary">
            Welcome
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}
          </h1>

          <p className="mt-2 text-text-secondary">
            Manage your units and
            monitor confirmed
            customer bookings.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            loadDashboard().catch(
              () => {}
            )
          }
          className="flex w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-soft"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {business && (
        <BusinessCard
          business={business}
        />
      )}

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Units"
          value={unitStats.total}
          helper={`${unitStats.active} active`}
          icon={<Building2 />}
        />

        <StatCard
          label="Available Units"
          value={unitStats.available}
          helper={`${unitStats.inactive} inactive`}
          icon={<CheckCircle2 />}
        />

        <StatCard
          label="Confirmed Bookings"
          value={bookingStats.total}
          helper={`${bookingStats.upcoming} upcoming`}
          icon={<CalendarDays />}
        />

        <StatCard
          label="Booking Revenue"
          value={`$${bookingStats.revenue.toFixed(
            2
          )}`}
          helper="Confirmed bookings"
          icon={<DollarSign />}
        />

      </section>

      <section className="mt-5 grid gap-5 sm:grid-cols-3">

        <MiniStat
          label="Upcoming"
          value={bookingStats.upcoming}
          icon={<Clock3 />}
        />

        <MiniStat
          label="Currently Active"
          value={bookingStats.active}
          icon={<Users />}
        />

        <MiniStat
          label="Completed"
          value={bookingStats.completed}
          icon={<ShieldCheck />}
        />

      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1fr_420px]">

        <div className="overflow-hidden rounded-2xl border border-border bg-white">

          <div className="border-b border-border p-5">

            <h2 className="text-lg font-bold text-secondary">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Latest confirmed
              customer bookings.
            </p>

          </div>

          {recentBookings.length > 0 ? (
            <div className="divide-y divide-border">

              {recentBookings.map(
                (booking) => (
                  <RecentBooking
                    key={booking._id}
                    booking={booking}
                  />
                )
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-text-muted">
              No confirmed bookings
              yet.
            </div>
          )}

        </div>

        <div className="rounded-2xl border border-border bg-white p-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <SearchCheck size={23} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-secondary">
            Verify Booking
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Enter the customer's
            booking code to confirm
            that the booking belongs
            to your business and is
            valid.
          </p>

          <form
            onSubmit={handleVerify}
            className="mt-6"
          >

            <input
              type="text"
              value={bookingCode}
              onChange={(e) =>
                setBookingCode(
                  e.target.value
                )
              }
              placeholder="Enter booking code"
              className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary"
            />

            <button
              type="submit"
              disabled={verifying}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {verifying && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {verifying
                ? "Verifying..."
                : "Verify Booking"}
            </button>

          </form>

          {verifiedBooking && (
            <VerifiedBooking
              booking={verifiedBooking}
            />
          )}

        </div>

      </section>

      <section className="mt-10">

        <div>
          <p className="text-sm font-semibold text-primary">
            Inventory
          </p>

          <h2 className="mt-1 text-2xl font-bold text-secondary">
            Recent Units
          </h2>
        </div>

        {units.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {units
              .slice(0, 6)
              .map((unit) => (
                <UnitCard
                  key={unit._id}
                  unit={unit}
                  category={
                    business?.category
                  }
                />
              ))}

          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-border bg-white p-12 text-center">

            <Building2
              size={35}
              className="mx-auto text-primary"
            />

            <h3 className="mt-4 text-lg font-bold text-secondary">
              No units yet
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              Add your first unit
              to start receiving
              bookings.
            </p>

          </div>
        )}

      </section>

    </BusinessLayout>
  );
};

const BusinessCard = ({
  business,
}) => {
  const image =
    business.images?.[0]?.url;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">

      <div className="grid md:grid-cols-[210px_1fr]">

        <div className="h-52 bg-surface-soft md:h-full">

          {image ? (
            <img
              src={image}
              alt={business.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">
              <ImageOff />
            </div>
          )}

        </div>

        <div className="p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div>

              <CategoryBadge
                category={
                  business.category
                }
              />

              <h2 className="mt-3 text-2xl font-bold text-secondary">
                {business.name}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">

                <MapPin size={15} />

                {business.address},{" "}
                {business.city}

              </p>

            </div>

            <span
              className={`h-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                business.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {business.status}
            </span>

          </div>

          {business.description && (
            <p className="mt-5 max-w-3xl text-sm leading-6 text-text-secondary">
              {business.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-text-secondary">

            <span>
              {business.contactPhone}
            </span>

            <span>
              {business.openHours}
            </span>

          </div>

        </div>

      </div>

    </section>
  );
};

const StatCard = ({
  label,
  value,
  helper,
  icon,
}) => (
  <div className="rounded-2xl border border-border bg-white p-6">

    <div className="flex items-start justify-between gap-4">

      <div>

        <p className="text-sm text-text-secondary">
          {label}
        </p>

        <p className="mt-3 text-3xl font-bold text-secondary">
          {value}
        </p>

        <p className="mt-2 text-xs text-text-muted">
          {helper}
        </p>

      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

    </div>

  </div>
);

const MiniStat = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">

    <div>

      <p className="text-sm text-text-secondary">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-secondary">
        {value}
      </p>

    </div>

    <div className="text-primary">
      {icon}
    </div>

  </div>
);

const RecentBooking = ({
  booking,
}) => {
  const customer =
    typeof booking.customerId ===
    "object"
      ? booking.customerId
      : null;

  const unit =
    typeof booking.unitId ===
    "object"
      ? booking.unitId
      : null;

  const status =
    getDateStatus(booking);

  return (
    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">

      <div>

        <div className="flex flex-wrap items-center gap-2">

          <p className="font-semibold text-secondary">
            {booking.code}
          </p>

          <StatusBadge
            status={status}
          />

        </div>

        <p className="mt-2 text-sm text-text-secondary">
          {customer?.fullName ||
            "Customer"}
          {" • "}
          {unit?.title ||
            "Unit"}
        </p>

        <p className="mt-1 text-xs text-text-muted">
          {formatDate(
            booking.startDate
          )}
          {" → "}
          {formatDate(
            booking.endDate
          )}
        </p>

      </div>

      <div className="sm:text-right">

        <p className="font-bold text-secondary">
          $
          {Number(
            booking.price || 0
          ).toFixed(2)}
        </p>

        <p className="mt-1 text-xs text-success">
          Confirmed
        </p>

      </div>

    </div>
  );
};

const VerifiedBooking = ({
  booking,
}) => {
  const customer =
    booking.customerId;

  const unit =
    booking.unitId;

  return (
    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

      <div className="flex items-center gap-2 text-green-700">

        <CheckCircle2 size={18} />

        <p className="font-semibold">
          Valid Booking
        </p>

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <VerifiedRow
          label="Code"
          value={booking.code}
        />

        <VerifiedRow
          label="Customer"
          value={
            customer?.fullName
          }
        />

        <VerifiedRow
          label="Phone"
          value={customer?.phone}
        />

        <VerifiedRow
          label="Unit"
          value={unit?.title}
        />

        <VerifiedRow
          label="Start"
          value={formatDate(
            booking.startDate
          )}
        />

        <VerifiedRow
          label="End"
          value={formatDate(
            booking.endDate
          )}
        />

      </div>

    </div>
  );
};

const VerifiedRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4">

    <span className="text-green-800/70">
      {label}
    </span>

    <span className="text-right font-semibold text-green-900">
      {value || "—"}
    </span>

  </div>
);

const UnitCard = ({
  unit,
  category,
}) => {
  const image =
    unit.images?.[0]?.url;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white">

      <div className="relative h-44 bg-surface-soft">

        {image ? (
          <img
            src={image}
            alt={unit.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <ImageOff />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <CategoryBadge
            category={category}
          />
        </div>

      </div>

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <h3 className="font-bold text-secondary">
              {unit.title}
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              {unit.code}
            </p>

          </div>

          <p className="font-bold text-primary">
            ${unit.price}
          </p>

        </div>

        <div className="mt-5 flex gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              unit.active
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {unit.active
              ? "Active"
              : "Inactive"}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              unit.isAvailable
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {unit.isAvailable
              ? "Available"
              : "Unavailable"}
          </span>

        </div>

        <UnitDetails
          unit={unit}
          category={category}
        />

      </div>

    </article>
  );
};

const UnitDetails = ({
  unit,
  category,
}) => {
  if (category === "hotel") {
    const details =
      unit.details?.hotel;

    return (
      <div className="mt-4 flex gap-4 text-xs text-text-secondary">

        <span className="flex items-center gap-1">
          <BedDouble size={14} />

          {details?.beds || 0}
          {" beds"}
        </span>

        <span>
          {details?.capacity || 0}
          {" guests"}
        </span>

      </div>
    );
  }

  if (category === "car_rental") {
    const details =
      unit.details?.car;

    return (
      <div className="mt-4 text-xs text-text-secondary">

        <Car
          size={14}
          className="mr-1 inline"
        />

        {details?.make}{" "}
        {details?.model}
        {" • "}
        {details?.seats}
        {" seats"}

      </div>
    );
  }

  const details =
    unit.details?.apartment;

  return (
    <div className="mt-4 text-xs text-text-secondary">

      {details?.bedrooms || 0}
      {" bedrooms • "}

      {details?.bathrooms || 0}
      {" bathrooms"}

    </div>
  );
};

const CategoryBadge = ({
  category,
}) => {
  const config = {
    hotel: {
      label: "Hotel",
      icon: <Hotel size={13} />,
    },

    car_rental: {
      label: "Car Rental",
      icon: <Car size={13} />,
    },

    apartment: {
      label: "Apartment",
      icon: (
        <Building2 size={13} />
      ),
    },
  };

  const item =
    config[category];

  if (!item) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-secondary shadow-sm">
      {item.icon}
      {item.label}
    </span>
  );
};

const getDateStatus = (
  booking
) => {
  const now = new Date();

  const start =
    new Date(booking.startDate);

  const end =
    new Date(booking.endDate);

  if (now < start) {
    return "upcoming";
  }

  if (
    now >= start &&
    now < end
  ) {
    return "active";
  }

  return "completed";
};

const StatusBadge = ({
  status,
}) => {
  const styles = {
    upcoming:
      "bg-blue-50 text-blue-700",

    active:
      "bg-green-50 text-green-700",

    completed:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
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

export default BusinessDashboard;