import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  Car,
  Clock3,
  Hotel,
  ImageOff,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import BusinessLayout from "../../components/business/BusinessLayout";

import useBusinessStore from "../../store/businessStore";
import useAuthStore from "../../store/authStore";

const Profile = () => {
  const business =
    useBusinessStore(
      (state) =>
        state.business
    );

  const getBusiness =
    useBusinessStore(
      (state) =>
        state.getBusiness
    );

  const user =
    useAuthStore(
      (state) => state.user
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getBusiness()
      .catch((error) =>
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load business"
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [getBusiness]);

  if (loading) {
    return (
      <BusinessLayout>

        <div className="flex min-h-[70vh] items-center justify-center">

          <LoaderCircle className="animate-spin text-primary" />

        </div>

      </BusinessLayout>
    );
  }

  if (!business) {
    return (
      <BusinessLayout>

        <div className="rounded-2xl border border-border bg-white p-12 text-center">

          <Building2
            size={36}
            className="mx-auto text-primary"
          />

          <h1 className="mt-4 text-2xl font-bold text-secondary">
            Business not found
          </h1>

        </div>

      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>

      <div>

        <p className="text-sm font-semibold text-primary">
          Business Account
        </p>

        <h1 className="mt-1 text-3xl font-bold text-secondary">
          Profile
        </h1>

        <p className="mt-2 text-text-secondary">
          View your business and
          account information.
        </p>

      </div>

      {/* BUSINESS */}

      <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-white">

        <BusinessGallery
          business={business}
        />

        <div className="p-6 md:p-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

            <div>

              <CategoryBadge
                category={
                  business.category
                }
              />

              <h2 className="mt-4 text-3xl font-bold text-secondary">
                {business.name}
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                {business.description ||
                  "No description provided."}
              </p>

            </div>

            <span
              className={`h-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                business.status ===
                "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {business.status}
            </span>

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <ProfileInfo
              icon={<Phone />}
              label="Contact Phone"
              value={
                business.contactPhone
              }
            />

            <ProfileInfo
              icon={<MapPin />}
              label="City"
              value={
                business.city
              }
            />

            <ProfileInfo
              icon={<MapPin />}
              label="Address"
              value={
                business.address
              }
            />

            <ProfileInfo
              icon={<Clock3 />}
              label="Opening Hours"
              value={
                business.openHours
              }
            />

          </div>

        </div>

      </section>

      {/* OWNER */}

      <section className="mt-8 rounded-2xl border border-border bg-white p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <UserRound />
          </div>

          <div>
            <h2 className="text-xl font-bold text-secondary">
              Owner Account
            </h2>

            <p className="text-sm text-text-muted">
              Account associated
              with this business.
            </p>
          </div>

        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <ProfileInfo
            icon={<UserRound />}
            label="Full Name"
            value={
              user?.fullName
            }
          />

          <ProfileInfo
            icon={<Mail />}
            label="Email"
            value={
              user?.email
            }
          />

          <ProfileInfo
            icon={<Phone />}
            label="Phone"
            value={
              user?.phone
            }
          />

          <ProfileInfo
            icon={
              <ShieldCheck />
            }
            label="Role"
            value={
              user?.role
            }
          />

        </div>

      </section>

    </BusinessLayout>
  );
};

const BusinessGallery = ({
  business,
}) => {
  const images =
    business.images || [];

  if (!images.length) {
    return (
      <div className="flex h-64 items-center justify-center bg-surface-soft">

        <div className="text-center text-text-muted">
          <ImageOff
            size={36}
            className="mx-auto"
          />

          <p className="mt-2">
            No business images
          </p>
        </div>

      </div>
    );
  }

  return (
    <div
      className={`grid gap-1 ${
        images.length > 1
          ? "md:grid-cols-2"
          : ""
      }`}
    >

      {images
        .slice(0, 4)
        .map(
          (image, index) => (
            <div
              key={
                image.publicId ||
                index
              }
              className="h-64 overflow-hidden"
            >
              <img
                src={image.url}
                alt={
                  business.name
                }
                className="h-full w-full object-cover"
              />
            </div>
          )
        )}

    </div>
  );
};

const ProfileInfo = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-4 rounded-xl bg-surface-soft p-4">

    <div className="mt-0.5 text-primary">
      {icon}
    </div>

    <div className="min-w-0">

      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold capitalize text-secondary">
        {value || "—"}
      </p>

    </div>

  </div>
);

const CategoryBadge = ({
  category,
}) => {
  const data = {
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
    data[category];

  if (!item) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
      {item.icon}
      {item.label}
    </span>
  );
};

export default Profile;