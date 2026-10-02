import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import useAdminStore from "../../store/adminStore";


const Refunds = () => {
  const refunds =
    useAdminStore(
      (state) => state.refunds
    );

  const users =
    useAdminStore(
      (state) => state.users
    );

  const getRefunds =
    useAdminStore(
      (state) =>
        state.getRefunds
    );

  const getUsers =
    useAdminStore(
      (state) =>
        state.getUsers
    );

  const updateRefundStatus =
    useAdminStore(
      (state) =>
        state.updateRefundStatus
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [
    updating,
    setUpdating,
  ] = useState(null);

  useEffect(() => {
    Promise.all([
      getRefunds(),
      getUsers(),
    ])
      .catch((error) =>
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load refunds"
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [
    getRefunds,
    getUsers,
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

  const data = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return refunds
      .map((refund) => ({
        ...refund,

        customer:
          userMap.get(
            String(
              refund.customerId
            )
          ),
      }))
      .filter((refund) => {
        const matchesSearch =
          !query ||
          refund.reason
            ?.toLowerCase()
            .includes(query) ||
          refund.customer
            ?.fullName
            ?.toLowerCase()
            .includes(query) ||
          String(refund._id)
            .toLowerCase()
            .includes(query);

        return (
          matchesSearch &&
          (status === "all" ||
            refund.status ===
              status)
        );
      });
  }, [
    refunds,
    userMap,
    search,
    status,
  ]);

  const handleUpdate = async (
    refund,
    newStatus
  ) => {
    try {
      setUpdating(
        refund._id
      );

      await updateRefundStatus(
        refund._id,
        newStatus
      );

      toast.success(
        `Refund ${newStatus}`
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Unable to update refund"
      );
    } finally {
      setUpdating(null);
    }
  };

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
    <AdminLayout>

      <p className="text-sm font-semibold text-primary">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-bold text-secondary">
        Refund Requests
      </h1>

      <p className="mt-2 text-text-secondary">
        Review and manage
        customer refund requests.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          title="Total"
          value={counts.total}
          icon={<RotateCcw />}
        />

        <Stat
          title="Pending"
          value={counts.pending}
          icon={<Clock3 />}
        />

        <Stat
          title="Accepted"
          value={counts.accepted}
          icon={
            <CheckCircle2 />
          }
        />

        <Stat
          title="Rejected"
          value={counts.rejected}
          icon={<XCircle />}
        />

      </div>

      {/* FILTER */}

      <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_200px]">

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
            placeholder="Search customer or reason..."
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none focus:border-primary"
          />

        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4"
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

      </div>

      {/* REQUESTS */}

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">

          <LoaderCircle className="animate-spin text-primary" />

        </div>
      ) : data.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-12 text-center text-text-muted">
          No refund requests found.
        </div>
      ) : (
        <div className="mt-6 space-y-4">

          {data.map(
            (refund) => (
              <article
                key={refund._id}
                className="rounded-2xl border border-border bg-white p-5 md:p-6"
              >

                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

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

                    <h2 className="mt-4 text-lg font-bold text-secondary">
                      {refund.customer
                        ?.fullName ||
                        "Customer"}
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                      {refund.customer
                        ?.email}
                    </p>

                    <div className="mt-5 rounded-xl bg-surface-soft p-4">

                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Reason
                      </p>

                      <p className="mt-2 leading-7 text-text-secondary">
                        {refund.reason}
                      </p>

                    </div>

                  </div>

                  <div className="w-full lg:w-[300px]">

                    <div className="space-y-3 text-sm">

                      <Detail
                        label="Booking"
                        value={
                          refund.bookingId
                        }
                      />

                      <Detail
                        label="Unit"
                        value={
                          refund.unitId
                        }
                      />

                      <Detail
                        label="Requested"
                        value={formatDate(
                          refund.createdAt
                        )}
                      />

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-wrap gap-2">

                      {refund.status !==
                        "accepted" && (
                        <button
                          type="button"
                          disabled={
                            updating ===
                            refund._id
                          }
                          onClick={() =>
                            handleUpdate(
                              refund,
                              "accepted"
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          <Check
                            size={16}
                          />

                          Accept
                        </button>
                      )}

                      {refund.status !==
                        "rejected" && (
                        <button
                          type="button"
                          disabled={
                            updating ===
                            refund._id
                          }
                          onClick={() =>
                            handleUpdate(
                              refund,
                              "rejected"
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          <X
                            size={16}
                          />

                          Reject
                        </button>
                      )}

                      {refund.status !==
                        "pending" && (
                        <button
                          type="button"
                          disabled={
                            updating ===
                            refund._id
                          }
                          onClick={() =>
                            handleUpdate(
                              refund,
                              "pending"
                            )
                          }
                          className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-secondary"
                        >
                          Move to Pending
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </AdminLayout>
  );
};


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

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};


const Stat = ({
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


const Detail = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4">

    <span className="text-text-muted">
      {label}
    </span>

    <span className="max-w-[65%] break-all text-right font-medium text-secondary">
      {value || "—"}
    </span>

  </div>
);


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


export default Refunds;