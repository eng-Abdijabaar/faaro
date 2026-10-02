import { useEffect, useMemo, useState, } from "react";

import { CheckCircle2, Clock3, Eye, LoaderCircle, ReceiptText, RotateCcw, Search, XCircle, } from "lucide-react";

import { Link, } from "react-router";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import useCustomerStore from "../store/customerStore";


const CustomerRefunds = () => {
  const refunds =
    useCustomerStore(
      (state) => state.refunds
    );

  const bookings =
    useCustomerStore(
      (state) => state.bookings
    );

  const getRefunds =
    useCustomerStore(
      (state) => state.getRefunds
    );

  const getBookings =
    useCustomerStore(
      (state) => state.getBookings
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");


  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          getRefunds(),
          getBookings(),
        ]);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load refunds"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    getRefunds,
    getBookings,
  ]);


  /* =========================
     BOOKING MAP
  ========================= */

  const bookingMap =
    useMemo(() => {
      return new Map(
        bookings.map(
          (booking) => [
            String(
              booking._id
            ),
            booking,
          ]
        )
      );
    }, [bookings]);


  /* =========================
     DATA
  ========================= */

  const data = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return refunds
      .map((refund) => {
        const bookingId =
          getId(
            refund.bookingId
          );

        return {
          ...refund,

          booking:
            bookingMap.get(
              bookingId
            ) || null,
        };
      })
      .filter((refund) => {
        const matchesSearch =
          !query ||
          refund.reason
            ?.toLowerCase()
            .includes(query) ||
          refund.booking
            ?.code
            ?.toLowerCase()
            .includes(query) ||
          String(
            refund._id
          )
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "all" ||
          refund.status ===
            status;

        return (
          matchesSearch &&
          matchesStatus
        );
      });
  }, [
    refunds,
    bookingMap,
    search,
    status,
  ]);


  /* =========================
     COUNTS
  ========================= */

  const counts = {
    total: refunds.length,

    pending:
      refunds.filter(
        (refund) =>
          refund.status ===
          "pending"
      ).length,

    accepted:
      refunds.filter(
        (refund) =>
          refund.status ===
          "accepted"
      ).length,

    rejected:
      refunds.filter(
        (refund) =>
          refund.status ===
          "rejected"
      ).length,
  };


  return (
    <div className="min-h-screen bg-background text-text-primary">

      <Navbar />

      <main className="mx-auto max-w-[1350px] px-5 py-10 md:px-8">

        {/* =====================
            HEADER
        ===================== */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Refund Center
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
            My Refunds
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
            View your refund
            requests and track their
            current review status.
          </p>

        </div>


        {/* =====================
            STATS
        ===================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total Requests"
            value={counts.total}
            icon={<RotateCcw />}
          />

          <StatCard
            label="Pending"
            value={counts.pending}
            icon={<Clock3 />}
          />

          <StatCard
            label="Accepted"
            value={
              counts.accepted
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            label="Rejected"
            value={
              counts.rejected
            }
            icon={<XCircle />}
          />

        </section>


        {/* =====================
            FILTERS
        ===================== */}

        <section className="mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_190px]">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search booking code or reason..."
              className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none transition focus:border-primary"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="rounded-xl border border-border px-4 outline-none focus:border-primary"
          >
            <option value="all">
              All statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="accepted">
              Accepted
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>

        </section>


        {/* =====================
            REFUNDS
        ===================== */}

        {loading ? (
          <Loading />
        ) : data.length ===
          0 ? (
          <EmptyState />
        ) : (
          <section className="mt-6 space-y-4">

            {data.map(
              (refund) => (
                <RefundCard
                  key={
                    refund._id
                  }
                  refund={
                    refund
                  }
                />
              )
            )}

          </section>
        )}

      </main>

    </div>
  );
};


/* =================================
   REFUND CARD
================================= */

const RefundCard = ({
  refund,
}) => {
  const booking =
    refund.booking;

  return (
    <article className="rounded-2xl border border-border bg-white p-5 transition hover:border-primary/30 hover:shadow-sm md:p-6">

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <RefundStatus
              status={
                refund.status
              }
            />

            <span className="text-xs text-text-muted">
              Refund #
              {String(
                refund._id
              ).slice(-8)}
            </span>

          </div>

          <div className="mt-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Booking
            </p>

            <h2 className="mt-1 text-lg font-bold text-secondary">
              {booking?.code ||
                `...${getId(
                  refund.bookingId
                ).slice(-8)}`}
            </h2>

          </div>

          <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-text-secondary">
            {refund.reason}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-text-muted">

            <span>
              Requested{" "}
              {formatDate(
                refund.createdAt
              )}
            </span>

            {booking?.price != null && (
              <span>
                Booking total:{" "}
                <strong className="text-secondary">
                  $
                  {Number(
                    booking.price
                  ).toFixed(2)}
                </strong>
              </span>
            )}

          </div>

        </div>

        <Link
          to={`/refunds/${refund._id}`}
          className="flex w-fit items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
        >
          <Eye size={17} />

          View Details
        </Link>

      </div>

    </article>
  );
};


/* =================================
   STATUS
================================= */

const RefundStatus = ({
  status,
}) => {
  const config = {
    pending: {
      text: "Pending Review",

      className:
        "bg-amber-50 text-amber-700",

      icon: (
        <Clock3 size={14} />
      ),
    },

    accepted: {
      text: "Accepted",

      className:
        "bg-green-50 text-green-700",

      icon: (
        <CheckCircle2
          size={14}
        />
      ),
    },

    rejected: {
      text: "Rejected",

      className:
        "bg-red-50 text-red-700",

      icon: (
        <XCircle size={14} />
      ),
    },
  };

  const item =
    config[status] ||
    config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${item.className}`}
    >
      {item.icon}

      {item.text}
    </span>
  );
};


/* =================================
   STAT
================================= */

const StatCard = ({label, value, icon, }) => (
  <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">

    <div>

      <p className="text-sm text-text-secondary">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-secondary">
        {value}
      </p>

    </div>

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
      {icon}
    </div>

  </div>
);


/* =================================
   EMPTY
================================= */

const EmptyState = () => (
  <div className="mt-6 rounded-2xl border border-border bg-white p-14 text-center">

    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">

      <ReceiptText
        size={27}
      />

    </div>

    <h2 className="mt-5 text-xl font-bold text-secondary">
      No refund requests
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
      When you request a refund
      for one of your bookings,
      you can track its status
      here.
    </p>

    <Link
      to="/bookings"
      className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
    >
      View My Bookings
    </Link>

  </div>
);


const Loading = () => (
  <div className="flex min-h-[400px] items-center justify-center">

    <LoaderCircle
      size={34}
      className="animate-spin text-primary"
    />

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


export default CustomerRefunds;