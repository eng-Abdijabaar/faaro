import {
  useEffect,
  useMemo,
} from "react";

import { Link } from "react-router";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";


const AdminDashboard = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const users = useAdminStore(
    (state) => state.users
  );

  const businesses = useAdminStore(
    (state) => state.businesses
  );

  const bookings = useAdminStore(
    (state) => state.bookings
  );

  const refunds = useAdminStore(
    (state) => state.refunds
  );

  const isLoading = useAdminStore(
    (state) => state.isLoading
  );

  const error = useAdminStore(
    (state) => state.error
  );

  const loadDashboard =
    useAdminStore(
      (state) =>
        state.loadDashboard
    );

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    loadDashboard().catch(
      () => {}
    );
  }, [loadDashboard]);

  /* =========================
     USER STATS
  ========================= */

  const userStats = useMemo(() => {
    return {
      total: users.length,

      customers: users.filter(
        (item) =>
          item.role === "customer"
      ).length,

      owners: users.filter(
        (item) =>
          item.role === "owner"
      ).length,

      suspended: users.filter(
        (item) =>
          item.status ===
          "suspended"
      ).length,
    };
  }, [users]);

  /* =========================
     BUSINESS STATS
  ========================= */

  const businessStats =
    useMemo(() => {
      return {
        total:
          businesses.length,

        active:
          businesses.filter(
            (item) =>
              item.status ===
              "active"
          ).length,

        suspended:
          businesses.filter(
            (item) =>
              item.status ===
              "suspended"
          ).length,
      };
    }, [businesses]);

  /* =========================
     BOOKING STATS
  ========================= */

  const bookingStats =
    useMemo(() => {
      return {
        total:
          bookings.length,

        paid:
          bookings.filter(
            (item) =>
              item.paymentStatus ===
              "paid"
          ).length,

        unpaid:
          bookings.filter(
            (item) =>
              item.paymentStatus !==
              "paid"
          ).length,

        valid:
          bookings.filter(
            (item) =>
              item.isValid
          ).length,
      };
    }, [bookings]);

  /* =========================
     REFUND STATS
  ========================= */

  const refundStats =
    useMemo(() => {
      return {
        total: refunds.length,

        pending:
          refunds.filter(
            (item) =>
              item.status ===
              "pending"
          ).length,

        accepted:
          refunds.filter(
            (item) =>
              item.status ===
              "accepted"
          ).length,

        rejected:
          refunds.filter(
            (item) =>
              item.status ===
              "rejected"
          ).length,
      };
    }, [refunds]);

  /* =========================
     RECENT
  ========================= */

  const recentBookings =
    useMemo(() => {
      return [...bookings]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        )
        .slice(0, 5);
    }, [bookings]);

  const recentRefunds =
    useMemo(() => {
      return [...refunds]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        )
        .slice(0, 5);
    }, [refunds]);

  if (isLoading) {
    return (
      <AdminShell>

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-text-secondary">
              Loading dashboard...
            </p>

          </div>

        </div>

      </AdminShell>
    );
  }

  return (
    <AdminShell>

      {/* =====================
          HEADER
      ===================== */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <p className="text-sm font-semibold text-primary">
            Admin Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-secondary">
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Monitor users,
            businesses, bookings and
            refund requests.
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
          <RefreshCcw
            size={17}
          />

          Refresh
        </button>

      </div>

      {/* =====================
          ERROR
      ===================== */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* =====================
          MAIN STATS
      ===================== */}

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Users"
          value={userStats.total}
          helper={`${userStats.customers} customers`}
          icon={<Users />}
        />

        <StatCard
          label="Businesses"
          value={
            businessStats.total
          }
          helper={`${businessStats.active} active`}
          icon={<Building2 />}
        />

        <StatCard
          label="Bookings"
          value={
            bookingStats.total
          }
          helper={`${bookingStats.valid} confirmed`}
          icon={
            <CalendarDays />
          }
        />

        <StatCard
          label="Refund Requests"
          value={
            refundStats.total
          }
          helper={`${refundStats.pending} pending`}
          icon={
            <RotateCcw />
          }
        />

      </section>

      {/* =====================
          SECONDARY STATS
      ===================== */}

      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <MiniStat
          label="Business Owners"
          value={
            userStats.owners
          }
          icon={<UserRound />}
        />

        <MiniStat
          label="Suspended Users"
          value={
            userStats.suspended
          }
          icon={
            <ShieldCheck />
          }
        />

        <MiniStat
          label="Paid Bookings"
          value={
            bookingStats.paid
          }
          icon={
            <WalletCards />
          }
        />

        <MiniStat
          label="Pending Refunds"
          value={
            refundStats.pending
          }
          icon={<Clock3 />}
        />

      </section>

      {/* =====================
          MANAGEMENT
      ===================== */}

      <section className="mt-10">

        <div>

          <p className="text-sm font-semibold text-primary">
            Management
          </p>

          <h2 className="mt-1 text-2xl font-bold text-secondary">
            Manage the platform
          </h2>

        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <ManagementCard
            to="/admin/users"
            title="Users"
            description="View customers and owners, inspect accounts and suspend users."
            value={userStats.total}
            icon={<Users />}
          />

          <ManagementCard
            to="/admin/businesses"
            title="Businesses"
            description="View registered hotels, rental companies and apartments."
            value={
              businessStats.total
            }
            icon={
              <Building2 />
            }
          />

          <ManagementCard
            to="/admin/bookings"
            title="Bookings"
            description="Monitor customer bookings and payment status."
            value={
              bookingStats.total
            }
            icon={
              <CalendarDays />
            }
          />

          <ManagementCard
            to="/admin/refunds"
            title="Refunds"
            description="Review pending refund requests and update their status."
            value={
              refundStats.pending
            }
            icon={
              <RotateCcw />
            }
          />

        </div>

      </section>

      {/* =====================
          DETAILS
      ===================== */}

      <section className="mt-10 grid gap-6 xl:grid-cols-2">

        {/* BOOKINGS */}

        <div className="rounded-2xl border border-border bg-white">

          <SectionHeader
            title="Recent Bookings"
            to="/admin/bookings"
          />

          {recentBookings.length >
          0 ? (
            <div className="divide-y divide-border">

              {recentBookings.map(
                (booking) => (
                  <RecentBooking
                    key={
                      booking._id
                    }
                    booking={
                      booking
                    }
                  />
                )
              )}

            </div>
          ) : (
            <EmptyRow
              text="No bookings yet"
            />
          )}

        </div>

        {/* REFUNDS */}

        <div className="rounded-2xl border border-border bg-white">

          <SectionHeader
            title="Recent Refund Requests"
            to="/admin/refunds"
          />

          {recentRefunds.length >
          0 ? (
            <div className="divide-y divide-border">

              {recentRefunds.map(
                (refund) => (
                  <RecentRefund
                    key={
                      refund._id
                    }
                    refund={
                      refund
                    }
                  />
                )
              )}

            </div>
          ) : (
            <EmptyRow
              text="No refund requests"
            />
          )}

        </div>

      </section>

      {/* =====================
          STATUS BREAKDOWN
      ===================== */}

      <section className="mt-10 grid gap-6 lg:grid-cols-2">

        <StatusPanel
          title="Booking Overview"
          items={[
            {
              label:
                "Paid Bookings",
              value:
                bookingStats.paid,
            },
            {
              label:
                "Unpaid Bookings",
              value:
                bookingStats.unpaid,
            },
            {
              label:
                "Confirmed Bookings",
              value:
                bookingStats.valid,
            },
          ]}
        />

        <StatusPanel
          title="Refund Overview"
          items={[
            {
              label:
                "Pending",
              value:
                refundStats.pending,
            },
            {
              label:
                "Accepted",
              value:
                refundStats.accepted,
            },
            {
              label:
                "Rejected",
              value:
                refundStats.rejected,
            },
          ]}
        />

      </section>

    </AdminShell>
  );
};


/* ===================================
   ADMIN SHELL
=================================== */

const AdminShell = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-background">

      <div className="flex">

        {/* SIDEBAR */}

        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-white lg:block">

          <div className="sticky top-0 p-6">

            <Link
              to="/admin"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-bold text-white">
                F
              </div>

              <div>

                <h2 className="font-bold text-secondary">
                  Faaro
                </h2>

                <p className="text-xs text-text-muted">
                  Administration
                </p>

              </div>

            </Link>

            <nav className="mt-9 space-y-2">

              <AdminNavItem
                to="/admin"
                label="Dashboard"
                icon={
                  <ShieldCheck
                    size={18}
                  />
                }
              />

              <AdminNavItem
                to="/admin/users"
                label="Users"
                icon={
                  <Users
                    size={18}
                  />
                }
              />

              <AdminNavItem
                to="/admin/businesses"
                label="Businesses"
                icon={
                  <Building2
                    size={18}
                  />
                }
              />

              <AdminNavItem
                to="/admin/bookings"
                label="Bookings"
                icon={
                  <CalendarDays
                    size={18}
                  />
                }
              />

              <AdminNavItem
                to="/admin/refunds"
                label="Refunds"
                icon={
                  <RotateCcw
                    size={18}
                  />
                }
              />

            </nav>

          </div>

        </aside>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          {/* MOBILE HEADER */}

          <div className="border-b border-border bg-white px-5 py-4 lg:hidden">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                F
              </div>

              <div>
                <p className="font-bold text-secondary">
                  Faaro Admin
                </p>

                <p className="text-xs text-text-muted">
                  Dashboard
                </p>
              </div>

            </div>

          </div>

          <main className="mx-auto max-w-[1500px] p-5 md:p-8">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
};


/* ===================================
   NAV
=================================== */

const AdminNavItem = ({
  to,
  label,
  icon,
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-primary"
  >
    {icon}

    {label}
  </Link>
);


/* ===================================
   STAT CARD
=================================== */

const StatCard = ({
  label,
  value,
  helper,
  icon,
}) => (
  <div className="rounded-2xl border border-border bg-white p-6">

    <div className="flex items-start justify-between gap-4">

      <div>

        <p className="text-sm font-medium text-text-secondary">
          {label}
        </p>

        <p className="mt-3 text-4xl font-bold text-secondary">
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


/* ===================================
   MINI STAT
=================================== */

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


/* ===================================
   MANAGEMENT
=================================== */

const ManagementCard = ({
  to,
  title,
  description,
  value,
  icon,
}) => (
  <Link
    to={to}
    className="group rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
  >

    <div className="flex items-start justify-between">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

      <span className="text-2xl font-bold text-secondary">
        {value}
      </span>

    </div>

    <h3 className="mt-5 text-lg font-bold text-secondary">
      {title}
    </h3>

    <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
      {description}
    </p>

    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">

      Manage

      <ArrowRight
        size={16}
        className="transition group-hover:translate-x-1"
      />

    </div>

  </Link>
);


/* ===================================
   SECTION HEADER
=================================== */

const SectionHeader = ({
  title,
  to,
}) => (
  <div className="flex items-center justify-between border-b border-border p-5">

    <h2 className="font-bold text-secondary">
      {title}
    </h2>

    <Link
      to={to}
      className="text-sm font-semibold text-primary"
    >
      View all
    </Link>

  </div>
);


/* ===================================
   RECENT BOOKING
=================================== */

const RecentBooking = ({
  booking,
}) => (
  <div className="flex items-center justify-between gap-4 p-5">

    <div className="min-w-0">

      <p className="truncate font-semibold text-secondary">
        {booking.code ||
          `Booking ${String(
            booking._id
          ).slice(-6)}`}
      </p>

      <p className="mt-1 text-xs text-text-muted">
        {formatDate(
          booking.createdAt
        )}
      </p>

    </div>

    <div className="text-right">

      <StatusBadge
        status={
          booking.isValid
            ? "confirmed"
            : booking.paymentStatus ===
                "paid"
              ? "processing"
              : "unpaid"
        }
      />

    </div>

  </div>
);


/* ===================================
   RECENT REFUND
=================================== */

const RecentRefund = ({
  refund,
}) => (
  <div className="flex items-center justify-between gap-4 p-5">

    <div className="min-w-0">

      <p className="truncate font-semibold text-secondary">
        Refund #
        {String(
          refund._id
        ).slice(-6)}
      </p>

      <p className="mt-1 max-w-xs truncate text-xs text-text-muted">
        {refund.reason}
      </p>

    </div>

    <StatusBadge
      status={
        refund.status
      }
    />

  </div>
);


/* ===================================
   STATUS BADGE
=================================== */

const StatusBadge = ({
  status,
}) => {
  const styles = {
    confirmed:
      "bg-green-50 text-green-700",

    processing:
      "bg-blue-50 text-blue-700",

    unpaid:
      "bg-amber-50 text-amber-700",

    pending:
      "bg-amber-50 text-amber-700",

    accepted:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
};


/* ===================================
   STATUS PANEL
=================================== */

const StatusPanel = ({
  title,
  items,
}) => (
  <div className="rounded-2xl border border-border bg-white p-6">

    <h2 className="text-lg font-bold text-secondary">
      {title}
    </h2>

    <div className="mt-6 space-y-5">

      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between"
        >

          <p className="text-sm text-text-secondary">
            {item.label}
          </p>

          <p className="text-xl font-bold text-secondary">
            {item.value}
          </p>

        </div>
      ))}

    </div>

  </div>
);


/* ===================================
   EMPTY
=================================== */

const EmptyRow = ({
  text,
}) => (
  <div className="p-10 text-center text-sm text-text-muted">
    {text}
  </div>
);


/* ===================================
   HELPERS
=================================== */

const formatDate = (date) => {
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


const formatLabel = (
  value
) => {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};


export default AdminDashboard;