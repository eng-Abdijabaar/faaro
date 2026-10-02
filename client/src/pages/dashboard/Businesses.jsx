import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Car,
  Hotel,
  ImageOff,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import useAdminStore from "../../store/adminStore";


const Businesses = () => {
  const businesses =
    useAdminStore(
      (state) =>
        state.businesses
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

  const [category, setCategory] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  useEffect(() => {
    getBusinesses()
      .catch((error) => {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load businesses"
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, [getBusinesses]);

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return businesses.filter(
        (business) => {
          const matchesSearch =
            !query ||
            business.name
              ?.toLowerCase()
              .includes(query) ||
            business.city
              ?.toLowerCase()
              .includes(query) ||
            business.contactPhone
              ?.toLowerCase()
              .includes(query);

          return (
            matchesSearch &&
            (category ===
              "all" ||
              business.category ===
                category) &&
            (status ===
              "all" ||
              business.status ===
                status)
          );
        }
      );
    }, [
      businesses,
      search,
      category,
      status,
    ]);

  return (
    <AdminLayout>

      <p className="text-sm font-semibold text-primary">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-bold text-secondary">
        Businesses
      </h1>

      <p className="mt-2 text-text-secondary">
        View all businesses
        registered on Faaro.
      </p>

      {/* FILTERS */}

      <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_190px_180px]">

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
            placeholder="Search businesses..."
            className="w-full rounded-xl border border-border py-3 pl-11 pr-4 outline-none focus:border-primary"
          />

        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="rounded-xl border border-border px-4"
        >
          <option value="all">
            All categories
          </option>

          <option value="hotel">
            Hotels
          </option>

          <option value="car_rental">
            Car Rentals
          </option>

          <option value="apartment">
            Apartments
          </option>
        </select>

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

          <option value="active">
            Active
          </option>

          <option value="suspended">
            Suspended
          </option>
        </select>

      </div>

      {loading ? (
        <div className="flex min-h-[450px] items-center justify-center">
          <LoaderCircle className="animate-spin text-primary" />
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-12 text-center text-text-muted">
          No businesses found.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map(
            (business) => (
              <BusinessCard
                key={
                  business._id
                }
                business={
                  business
                }
              />
            )
          )}

        </div>
      )}

    </AdminLayout>
  );
};


const BusinessCard = ({
  business,
}) => {
  const image =
    business.images?.[0]?.url;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white">

      <div className="relative h-52 bg-surface-soft">

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

        <div className="absolute left-4 top-4">
          <CategoryBadge
            category={
              business.category
            }
          />
        </div>

      </div>

      <div className="p-6">

        <div className="flex items-start justify-between gap-3">

          <div>
            <h2 className="text-xl font-bold text-secondary">
              {business.name}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={15} />

              {business.city}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              business.status ===
              "active"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {business.status}
          </span>

        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-secondary">
          {business.description ||
            "No description"}
        </p>

        <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">

          <Detail
            label="Phone"
            value={
              business.contactPhone
            }
          />

          <Detail
            label="Address"
            value={
              business.address
            }
          />

          <Detail
            label="Opening"
            value={
              business.openHours
            }
          />

          <Detail
            label="Owner ID"
            value={
              business.ownerId
            }
          />

        </div>

      </div>

    </article>
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

  const item =
    config[category];

  if (!item) return null;

  return (
    <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-secondary shadow">
      {item.icon}
      {item.label}
    </span>
  );
};


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


export default Businesses;