import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Search,
  ShieldBan,
  UserRound,
  Users as UsersIcon,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";


const Users = () => {
  const users = useAdminStore(
    (state) => state.users
  );

  const getUsers = useAdminStore(
    (state) => state.getUsers
  );

  const suspendUser = useAdminStore(
    (state) => state.suspendUser
  );

  const createBusiness =
    useAdminStore(
      (state) =>
        state.createBusiness
    );

  const currentUser =
    useAuthStore(
      (state) => state.user
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null);

  const [
    businessUser,
    setBusinessUser,
  ] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        await getUsers();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getUsers]);

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesSearch =
            !query ||
            user.fullName
              ?.toLowerCase()
              .includes(query) ||
            user.email
              ?.toLowerCase()
              .includes(query) ||
            user.phone
              ?.toLowerCase()
              .includes(query);

          const matchesRole =
            role === "all" ||
            user.role === role;

          const matchesStatus =
            status === "all" ||
            user.status === status;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      role,
      status,
    ]);

  const handleSuspend = async (
    user
  ) => {
    const currentId =
      currentUser?._id ||
      currentUser?.id;

    if (
      String(currentId) ===
      String(user._id)
    ) {
      toast.error(
        "You cannot suspend yourself"
      );

      return;
    }

    try {
      setActionLoading(
        user._id
      );

      await suspendUser(
        user._id
      );

      toast.success(
        "User suspended"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to suspend user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: users.length,

    customers:
      users.filter(
        (user) =>
          user.role ===
          "customer"
      ).length,

    owners:
      users.filter(
        (user) =>
          user.role === "owner"
      ).length,

    suspended:
      users.filter(
        (user) =>
          user.status ===
          "suspended"
      ).length,
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Users"
        description="Manage customers, business owners and platform accounts."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          title="Total Users"
          value={stats.total}
          icon={<UsersIcon />}
        />

        <Stat
          title="Customers"
          value={stats.customers}
          icon={<UserRound />}
        />

        <Stat
          title="Owners"
          value={stats.owners}
          icon={<Building2 />}
        />

        <Stat
          title="Suspended"
          value={stats.suspended}
          icon={<ShieldBan />}
        />

      </div>

      {/* FILTERS */}

      <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_180px_180px]">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none focus:border-primary"
          />

        </div>

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4 outline-none"
        >
          <option value="all">
            All roles
          </option>

          <option value="customer">
            Customers
          </option>

          <option value="owner">
            Owners
          </option>

          <option value="admin">
            Admins
          </option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4 outline-none"
        >
          <option value="all">
            All statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="suspended">
            Suspended
          </option>
        </select>

      </div>

      {/* USERS */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">

        {loading ? (
          <Loading />
        ) : filteredUsers.length ===
          0 ? (
          <Empty text="No users found" />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-border bg-surface-soft text-left text-xs uppercase tracking-wide text-text-muted">

                <tr>
                  <th className="px-5 py-4">
                    User
                  </th>

                  <th className="px-5 py-4">
                    Phone
                  </th>

                  <th className="px-5 py-4">
                    Role
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Verified
                  </th>

                  <th className="px-5 py-4">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-border">

                {filteredUsers.map(
                  (user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-surface-soft/50"
                    >

                      <td className="px-5 py-4">

                        <p className="font-semibold text-secondary">
                          {user.fullName}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          {user.email}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {user.phone ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          value={
                            user.role
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <Status
                          value={
                            user.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">

                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
                            <CheckCircle2
                              size={15}
                            />

                            Yes
                          </span>
                        ) : (
                          <span className="text-sm text-text-muted">
                            No
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex flex-wrap gap-2">

                          {user.role ===
                            "customer" &&
                            user.status ===
                              "active" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setBusinessUser(
                                    user
                                  )
                                }
                                className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white"
                              >
                                Make Owner
                              </button>
                            )}

                          {user.status ===
                            "active" &&
                            String(
                              currentUser?._id ||
                                currentUser?.id
                            ) !==
                              String(
                                user._id
                              ) && (
                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  user._id
                                }
                                onClick={() =>
                                  handleSuspend(
                                    user
                                  )
                                }
                                className="rounded-lg border border-danger/30 px-3 py-2 text-xs font-semibold text-danger disabled:opacity-50"
                              >
                                {actionLoading ===
                                user._id
                                  ? "Suspending..."
                                  : "Suspend"}
                              </button>
                            )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {businessUser && (
        <BusinessModal
          user={businessUser}
          createBusiness={
            createBusiness
          }
          onClose={() =>
            setBusinessUser(
              null
            )
          }
        />
      )}

    </AdminLayout>
  );
};


/* BUSINESS MODAL */

const BusinessModal = ({
  user,
  createBusiness,
  onClose,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [images, setImages] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      category: "hotel",
      contactPhone:
        user.phone || "",
      city: "",
      address: "",
      openHours: "",
    });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        new FormData();

      Object.entries(
        form
      ).forEach(
        ([key, value]) => {
          data.append(
            key,
            value
          );
        }
      );

      images.forEach(
        (image) =>
          data.append(
            "images",
            image
          )
      );

      await createBusiness({
        userId: user._id,
        formData: data,
      });

      toast.success(
        "Business owner created successfully"
      );

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create business"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-2xl font-bold text-secondary">
              Create Business
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Convert{" "}
              {user.fullName} into
              a business owner.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              name="name"
              label="Business Name"
              value={form.name}
              onChange={
                handleChange
              }
            />

            <label>

              <span className="mb-2 block text-sm font-semibold text-secondary">
                Category
              </span>

              <select
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-border px-4 py-3 outline-none"
              >
                <option value="hotel">
                  Hotel
                </option>

                <option value="car_rental">
                  Car Rental
                </option>

                <option value="apartment">
                  Apartment
                </option>
              </select>

            </label>

            <Input
              name="contactPhone"
              label="Contact Phone"
              value={
                form.contactPhone
              }
              onChange={
                handleChange
              }
            />

            <Input
              name="city"
              label="City"
              value={form.city}
              onChange={
                handleChange
              }
            />

            <Input
              name="address"
              label="Address"
              value={form.address}
              onChange={
                handleChange
              }
            />

            <Input
              name="openHours"
              label="Opening Hours"
              placeholder="8:00 AM - 10:00 PM"
              value={
                form.openHours
              }
              onChange={
                handleChange
              }
            />

          </div>

          <label className="block">

            <span className="mb-2 block text-sm font-semibold text-secondary">
              Description
            </span>

            <textarea
              name="description"
              rows={4}
              value={
                form.description
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
            />

          </label>

          <label className="block cursor-pointer rounded-xl border border-dashed border-border p-5">

            <div className="flex items-center gap-3">

              <ImagePlus className="text-primary" />

              <div>

                <p className="font-semibold text-secondary">
                  Business Images
                </p>

                <p className="text-xs text-text-muted">
                  Up to 5 images
                </p>

              </div>

            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImages(
                  Array.from(
                    e.target.files ||
                      []
                  ).slice(0, 5)
                )
              }
            />

            {images.length >
              0 && (
              <p className="mt-3 text-sm text-primary">
                {images.length} image(s)
                selected
              </p>
            )}

          </label>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 font-semibold text-secondary"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Business"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


const Input = ({
  label,
  ...props
}) => (
  <label>

    <span className="mb-2 block text-sm font-semibold text-secondary">
      {label}
    </span>

    <input
      required
      {...props}
      className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
    />

  </label>
);


const PageHeader = ({
  title,
  description,
}) => (
  <>
    <p className="text-sm font-semibold text-primary">
      Administration
    </p>

    <h1 className="mt-1 text-3xl font-bold text-secondary">
      {title}
    </h1>

    <p className="mt-2 text-text-secondary">
      {description}
    </p>
  </>
);


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


const Badge = ({ value }) => (
  <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold capitalize text-primary">
    {value}
  </span>
);


const Status = ({ value }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      value === "active"
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    {value}
  </span>
);


const Loading = () => (
  <div className="flex min-h-[350px] items-center justify-center">
    <LoaderCircle className="animate-spin text-primary" />
  </div>
);


const Empty = ({ text }) => (
  <div className="p-12 text-center text-text-muted">
    {text}
  </div>
);


export default Users;