import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  LoaderCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import BusinessLayout from "../../components/business/BusinessLayout";
import useBusinessStore from "../../store/businessStore";

const Bookings = () => {
  const bookings =
    useBusinessStore(
      (state) =>
        state.bookings
    );

  const getBookings =
    useBusinessStore(
      (state) =>
        state.getBookings
    );

  const getBookingById =
    useBusinessStore(
      (state) =>
        state.getBookingById
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState(null);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  useEffect(() => {
    getBookings()
      .catch((error) => {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load bookings"
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, [getBookings]);

  const filteredBookings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return bookings.filter(
        (booking) => {
          const customer =
            booking.customerId;

          const unit =
            booking.unitId;

          const status =
            getBookingStatus(
              booking
            );

          const matchesSearch =
            !query ||
            booking.code
              ?.toLowerCase()
              .includes(query) ||
            customer?.fullName
              ?.toLowerCase()
              .includes(query) ||
            customer?.email
              ?.toLowerCase()
              .includes(query) ||
            unit?.title
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            filter === "all" ||
            filter ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      bookings,
      search,
      filter,
    ]);

  const counts = {
    all: bookings.length,

    upcoming:
      bookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) === "upcoming"
      ).length,

    active:
      bookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) === "active"
      ).length,

    completed:
      bookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) ===
          "completed"
      ).length,
  };

  const openDetails =
    async (booking) => {
      try {
        setDetailsLoading(true);

        const data =
          await getBookingById(
            booking._id
          );

        setSelectedBooking(
          data
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load booking"
        );
      } finally {
        setDetailsLoading(false);
      }
    };

  return (
    <BusinessLayout>

      <div>
        <p className="text-sm font-semibold text-primary">
          Reservations
        </p>

        <h1 className="mt-1 text-3xl font-bold text-secondary">
          Bookings
        </h1>

        <p className="mt-2 text-text-secondary">
          View confirmed bookings
          for your business.
        </p>
      </div>

      {/* STATS */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Summary
          title="Total"
          value={counts.all}
          icon={
            <CalendarDays />
          }
        />

        <Summary
          title="Upcoming"
          value={
            counts.upcoming
          }
          icon={<Clock3 />}
        />

        <Summary
          title="Active"
          value={counts.active}
          icon={
            <CheckCircle2 />
          }
        />

        <Summary
          title="Completed"
          value={
            counts.completed
          }
          icon={
            <CalendarDays />
          }
        />

      </div>

      {/* FILTER */}

      <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_190px]">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search booking, customer or unit..."
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none focus:border-primary"
          />

        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4"
        >
          <option value="all">
            All bookings
          </option>

          <option value="upcoming">
            Upcoming
          </option>

          <option value="active">
            Active
          </option>

          <option value="completed">
            Completed
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">

        {loading ? (
          <Loading />
        ) : filteredBookings.length ===
          0 ? (
          <div className="p-14 text-center text-text-muted">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead className="border-b border-border bg-surface-soft text-left text-xs uppercase tracking-wide text-text-muted">

                <tr>
                  <th className="px-5 py-4">
                    Booking
                  </th>

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Unit
                  </th>

                  <th className="px-5 py-4">
                    Dates
                  </th>

                  <th className="px-5 py-4">
                    Price
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-border">

                {filteredBookings.map(
                  (booking) => {
                    const customer =
                      booking.customerId;

                    const unit =
                      booking.unitId;

                    const status =
                      getBookingStatus(
                        booking
                      );

                    return (
                      <tr
                        key={
                          booking._id
                        }
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold text-secondary">
                            {booking.code}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {formatDate(
                              booking.createdAt
                            )}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <p className="font-medium text-secondary">
                            {customer?.fullName ||
                              "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {customer?.phone}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-sm text-secondary">
                          {unit?.title ||
                            "Unit"}
                        </td>

                        <td className="px-5 py-4 text-sm text-text-secondary">
                          {formatDate(
                            booking.startDate
                          )}
                          {" → "}
                          {formatDate(
                            booking.endDate
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-secondary">
                          $
                          {Number(
                            booking.price ||
                              0
                          ).toFixed(2)}
                        </td>

                        <td className="px-5 py-4">
                          <BookingStatus
                            status={
                              status
                            }
                          />
                        </td>

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              openDetails(
                                booking
                              )
                            }
                            disabled={
                              detailsLoading
                            }
                            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-secondary"
                          >
                            <Eye size={15} />

                            Details
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {selectedBooking && (
        <BookingModal
          booking={
            selectedBooking
          }
          onClose={() =>
            setSelectedBooking(
              null
            )
          }
        />
      )}

    </BusinessLayout>
  );
};

const BookingModal = ({
  booking,
  onClose,
}) => {
  const customer =
    booking.customerId;

  const unit =
    booking.unitId;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-xl rounded-3xl bg-white p-6">

        <div className="flex justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-primary">
              Booking Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-secondary">
              {booking.code}
            </h2>
          </div>

          <button
            onClick={onClose}
          >
            <X />
          </button>

        </div>

        <div className="mt-7 divide-y divide-border">

          <Row
            label="Customer"
            value={
              customer?.fullName
            }
          />

          <Row
            label="Email"
            value={
              customer?.email
            }
          />

          <Row
            label="Phone"
            value={
              customer?.phone
            }
          />

          <Row
            label="Unit"
            value={
              unit?.title
            }
          />

          <Row
            label="Unit Code"
            value={unit?.code}
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
            label="Price"
            value={`$${Number(
              booking.price ||
                0
            ).toFixed(2)}`}
          />

          <Row
            label="Payment"
            value={
              booking.paymentStatus
            }
          />

          <Row
            label="Status"
            value={
              getBookingStatus(
                booking
              )
            }
          />

        </div>

      </div>

    </div>
  );
};

const Summary = ({
  title,
  value,
  icon,
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">

    <div>
      <p className="text-sm text-text-secondary">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-secondary">
        {value}
      </p>
    </div>

    <div className="text-primary">
      {icon}
    </div>

  </div>
);

const BookingStatus = ({
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
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const Row = ({
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

const getBookingStatus = (
  booking
) => {
  const now = new Date();

  const start =
    new Date(
      booking.startDate
    );

  const end =
    new Date(
      booking.endDate
    );

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

const Loading = () => (
  <div className="flex min-h-[350px] items-center justify-center">

    <LoaderCircle className="animate-spin text-primary" />

  </div>
);

export default Bookings;