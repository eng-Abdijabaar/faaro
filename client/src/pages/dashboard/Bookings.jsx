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
  WalletCards,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import useAdminStore from "../../store/adminStore";


const Bookings = () => {
  const bookings =
    useAdminStore(
      (state) =>
        state.bookings
    );

  const users =
    useAdminStore(
      (state) => state.users
    );

  const businesses =
    useAdminStore(
      (state) =>
        state.businesses
    );

  const getBookings =
    useAdminStore(
      (state) =>
        state.getBookings
    );

  const getUsers =
    useAdminStore(
      (state) =>
        state.getUsers
    );

  const getBusinesses =
    useAdminStore(
      (state) =>
        state.getBusinesses
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [payment, setPayment] =
    useState("all");

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState(null);

  useEffect(() => {
    Promise.all([
      getBookings(),
      getUsers(),
      getBusinesses(),
    ])
      .catch((error) =>
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load bookings"
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [
    getBookings,
    getUsers,
    getBusinesses,
  ]);

  const userMap = useMemo(
    () =>
      new Map(
        users.map((user) => [
          String(user._id),
          user,
        ])
      ),
    [users]
  );

  const businessMap =
    useMemo(
      () =>
        new Map(
          businesses.map(
            (business) => [
              String(
                business._id
              ),
              business,
            ]
          )
        ),
      [businesses]
    );

  const data = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return bookings
      .map((booking) => {
        const customer =
          userMap.get(
            String(
              booking.customerId
            )
          );

        const business =
          businessMap.get(
            String(
              booking.businessId
            )
          );

        return {
          ...booking,
          customer,
          business,
        };
      })
      .filter((booking) => {
        const matchesSearch =
          !query ||
          booking.code
            ?.toLowerCase()
            .includes(query) ||
          booking.customer?.fullName
            ?.toLowerCase()
            .includes(query) ||
          booking.business?.name
            ?.toLowerCase()
            .includes(query);

        const matchesPayment =
          payment === "all" ||
          booking.paymentStatus ===
            payment;

        return (
          matchesSearch &&
          matchesPayment
        );
      });
  }, [
    bookings,
    userMap,
    businessMap,
    search,
    payment,
  ]);

  const paid =
    bookings.filter(
      (booking) =>
        booking.paymentStatus ===
        "paid"
    ).length;

  const confirmed =
    bookings.filter(
      (booking) =>
        booking.isValid
    ).length;

  return (
    <AdminLayout>

      <p className="text-sm font-semibold text-primary">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-bold text-secondary">
        Bookings
      </h1>

      <p className="mt-2 text-text-secondary">
        Monitor bookings and
        payment status across the
        platform.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">

        <Summary
          label="Total"
          value={bookings.length}
          icon={<CalendarDays />}
        />

        <Summary
          label="Paid"
          value={paid}
          icon={<WalletCards />}
        />

        <Summary
          label="Confirmed"
          value={confirmed}
          icon={
            <CheckCircle2 />
          }
        />

      </div>

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
            placeholder="Search booking, customer or business..."
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none focus:border-primary"
          />

        </div>

        <select
          value={payment}
          onChange={(e) =>
            setPayment(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4"
        >
          <option value="all">
            All payments
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="unpaid">
            Unpaid
          </option>
        </select>

      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">

        {loading ? (
          <Loading />
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b border-border bg-surface-soft text-left text-xs uppercase text-text-muted">

                <tr>
                  <th className="px-5 py-4">
                    Booking
                  </th>

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Business
                  </th>

                  <th className="px-5 py-4">
                    Dates
                  </th>

                  <th className="px-5 py-4">
                    Payment
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

                {data.map(
                  (booking) => (
                    <tr
                      key={
                        booking._id
                      }
                    >

                      <td className="px-5 py-4">

                        <p className="font-semibold text-secondary">
                          {booking.code ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(
                            booking.createdAt
                          )}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-sm">
                        {booking.customer
                          ?.fullName ||
                          shortId(
                            booking.customerId
                          )}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {booking.business
                          ?.name ||
                          shortId(
                            booking.businessId
                          )}
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

                      <td className="px-5 py-4">
                        <PaymentBadge
                          status={
                            booking.paymentStatus
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <BookingBadge
                          booking={
                            booking
                          }
                        />
                      </td>

                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-secondary"
                        >
                          <Eye
                            size={15}
                          />

                          Details
                        </button>

                      </td>

                    </tr>
                  )
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

    </AdminLayout>
  );
};


const BookingModal = ({
  booking,
  onClose,
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-xl rounded-3xl bg-white p-6">

      <div className="flex justify-between">

        <div>
          <p className="text-sm text-primary">
            Booking
          </p>

          <h2 className="mt-1 text-2xl font-bold text-secondary">
            {booking.code}
          </h2>
        </div>

        <button onClick={onClose}>
          <X />
        </button>

      </div>

      <div className="mt-7 divide-y divide-border">

        <Row
          label="Customer"
          value={
            booking.customer
              ?.fullName ||
            shortId(
              booking.customerId
            )
          }
        />

        <Row
          label="Business"
          value={
            booking.business?.name ||
            shortId(
              booking.businessId
            )
          }
        />

        <Row
          label="Unit ID"
          value={
            booking.unitId
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
          label="Price"
          value={
            booking.price != null
              ? `$${booking.price}`
              : "—"
          }
        />

        <Row
          label="Payment"
          value={
            booking.paymentStatus ||
            "unpaid"
          }
        />

        <Row
          label="Valid"
          value={
            booking.isValid
              ? "Yes"
              : "No"
          }
        />

        <Row
          label="Booking Status"
          value={
            booking.status
          }
        />

        {booking.stripeSessionId && (
          <Row
            label="Stripe Session"
            value={
              booking.stripeSessionId
            }
          />
        )}

      </div>

    </div>

  </div>
);


const Summary = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">

    <div>
      <p className="text-sm text-text-secondary">
        {label}
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


const PaymentBadge = ({
  status,
}) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      status === "paid"
        ? "bg-green-50 text-green-700"
        : "bg-amber-50 text-amber-700"
    }`}
  >
    {status === "paid"
      ? "Paid"
      : "Unpaid"}
  </span>
);


const BookingBadge = ({
  booking,
}) => {
  if (
    booking.status ===
    "cancelled"
  ) {
    return (
      <Badge
        text="Cancelled"
        type="red"
      />
    );
  }

  if (
    booking.status ===
    "expired"
  ) {
    return (
      <Badge
        text="Expired"
        type="gray"
      />
    );
  }

  if (!booking.isValid) {
    return (
      <Badge
        text={
          booking.paymentStatus ===
          "paid"
            ? "Processing"
            : "Pending"
        }
        type="yellow"
      />
    );
  }

  return (
    <Badge
      text="Confirmed"
      type="green"
    />
  );
};


const Badge = ({
  text,
  type,
}) => {
  const styles = {
    green:
      "bg-green-50 text-green-700",

    yellow:
      "bg-amber-50 text-amber-700",

    red:
      "bg-red-50 text-red-700",

    gray:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}
    >
      {text}
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

    <span className="max-w-[65%] break-all text-right font-semibold text-secondary">
      {value || "—"}
    </span>

  </div>
);


const Loading = () => (
  <div className="flex min-h-[350px] items-center justify-center">
    <LoaderCircle className="animate-spin text-primary" />
  </div>
);


const shortId = (id) =>
  id
    ? `...${String(id).slice(-8)}`
    : "—";


const formatDate = (date) =>
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


export default Bookings;