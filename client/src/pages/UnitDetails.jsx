import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  FileImage,
  Hotel,
  ImageOff,
  LoaderCircle,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import useAuthStore from "../store/authStore";
import useCustomerStore from "../store/customerStore";


const UnitDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  /* =========================
     AUTH
  ========================= */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  /* =========================
     CUSTOMER STORE
  ========================= */

  const unit = useCustomerStore(
    (state) => state.unit
  );

  const business =
    useCustomerStore(
      (state) => state.business
    );

  const getUnitById =
    useCustomerStore(
      (state) =>
        state.getUnitById
    );

  const getBusinessById =
    useCustomerStore(
      (state) =>
        state.getBusinessById
    );

  const createBooking =
    useCustomerStore(
      (state) =>
        state.createBooking
    );

  const clearSelectedUnit =
    useCustomerStore(
      (state) =>
        state.clearSelectedUnit
    );

  /* =========================
     LOCAL STATE
  ========================= */

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    document,
    setDocument,
  ] = useState(null);

  const [
    bookingData,
    setBookingData,
  ] = useState({
    startDate:
      searchParams.get(
        "startDate"
      ) || "",

    endDate:
      searchParams.get(
        "endDate"
      ) || "",
  });

  /* =========================
     LOAD UNIT + BUSINESS
  ========================= */

  useEffect(() => {
    const loadUnit = async () => {
      try {
        setPageLoading(true);
        setPageError("");

        const unitData =
          await getUnitById(id);

        await getBusinessById(
          unitData.businessId
        );
      } catch (error) {
        setPageError(
          error.response?.data
            ?.message ||
            "Unable to load unit"
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadUnit();

    return () => {
      clearSelectedUnit();
    };
  }, [
    id,
    getUnitById,
    getBusinessById,
    clearSelectedUnit,
  ]);

  /* =========================
     CATEGORY
  ========================= */

  const category =
    business?.category || "";

  /* =========================
     IMAGES
  ========================= */

  const images = useMemo(() => {
    return (
      unit?.images
        ?.map(
          (image) => image.url
        )
        .filter(Boolean) || []
    );
  }, [unit]);

  /* =========================
     DURATION
  ========================= */

  const duration = useMemo(() => {
    if (
      !bookingData.startDate ||
      !bookingData.endDate
    ) {
      return 0;
    }

    const start = new Date(
      bookingData.startDate
    );

    const end = new Date(
      bookingData.endDate
    );

    const difference =
      (end.getTime() -
        start.getTime()) /
      (1000 * 60 * 60 * 24);

    return difference > 0
      ? difference
      : 0;
  }, [
    bookingData.startDate,
    bookingData.endDate,
  ]);

  const total =
    duration *
    Number(unit?.price || 0);

  const period =
    category === "car_rental"
      ? "day"
      : "night";

  /* =========================
     IMAGE CONTROLS
  ========================= */

  const nextImage = () => {
    if (!images.length) return;

    setSelectedImage(
      (prev) =>
        prev ===
        images.length - 1
          ? 0
          : prev + 1
    );
  };

  const previousImage = () => {
    if (!images.length) return;

    setSelectedImage(
      (prev) =>
        prev === 0
          ? images.length - 1
          : prev - 1
    );
  };

  /* =========================
     DOCUMENT
  ========================= */

  const handleDocument = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      setDocument(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "Document must be JPEG, PNG or WebP"
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Document must be less than 5MB"
      );

      e.target.value = "";

      return;
    }

    setDocument(file);
  };

  /* =========================
     CREATE BOOKING
  ========================= */

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error(
        "Please sign in before booking"
      );

      navigate("/signin");

      return;
    }

    if (
      user?.role !== "customer"
    ) {
      toast.error(
        "Only customers can create bookings"
      );

      return;
    }

    if (
      !bookingData.startDate ||
      !bookingData.endDate
    ) {
      toast.error(
        "Please select booking dates"
      );

      return;
    }

    if (duration <= 0) {
      toast.error(
        "End date must be after start date"
      );

      return;
    }

    try {
      setBookingLoading(true);

      await createBooking({
        unitId: unit._id,

        businessId:
          business._id,

        startDate:
          bookingData.startDate,

        endDate:
          bookingData.endDate,

        document,
      });

      toast.success(
        "Booking created successfully"
      );

      navigate("/bookings");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to create booking"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =========================
     SHARE
  ========================= */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            unit?.title ||
            "Faaro Booking",

          url:
            window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      toast.success(
        "Link copied"
      );
    } catch {
      // Customer cancelled share.
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (pageLoading) {
    return (
      <>
        <Navbar />

        <LoadingPage
          text="Loading unit..."
        />
      </>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (
    pageError ||
    !unit ||
    !business
  ) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">

          <div className="max-w-md text-center">

            <h1 className="text-2xl font-bold text-secondary">
              Unable to load unit
            </h1>

            <p className="mt-3 text-text-secondary">
              {pageError ||
                "Unit not found"}
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              Back to Explore
            </Link>

          </div>

        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* =====================
          NAVBAR
      ===================== */}

      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">

        {/* =====================
            BACK
        ===================== */}

        <Link
          to={`/explore?category=${category}`}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft
            size={18}
          />

          Back to Explore
        </Link>

        {/* =====================
            HEADER
        ===================== */}

        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <CategoryBadge
              category={category}
            />

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
              {unit.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-secondary">

              <span className="flex items-center gap-2">

                <MapPin
                  size={17}
                />

                {unit.address ||
                  business.address}

              </span>

              <span>
                •
              </span>

              <span>
                {business.name}
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-secondary transition hover:bg-surface-soft"
          >
            <Share2
              size={17}
            />

            Share
          </button>

        </div>

        {/* =====================
            GALLERY
        ===================== */}

        <Gallery
          images={images}
          title={unit.title}
          selectedImage={
            selectedImage
          }
          setSelectedImage={
            setSelectedImage
          }
          nextImage={
            nextImage
          }
          previousImage={
            previousImage
          }
        />

        {/* =====================
            CONTENT
        ===================== */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">

          {/* =================
              LEFT
          ================= */}

          <div>

            {/* BUSINESS */}

            <section className="flex items-center justify-between border-b border-border pb-8">

              <div>

                <p className="text-sm text-text-muted">
                  Provided by
                </p>

                <h2 className="mt-1 text-xl font-bold text-secondary">
                  {business.name}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {business.city}

                  {business.openHours &&
                    ` • ${business.openHours}`}
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">

                <BusinessIcon
                  category={
                    category
                  }
                />

              </div>

            </section>

            {/* QUICK DETAILS */}

            <QuickDetails
              unit={unit}
              category={category}
            />

            {/* UNIT DESCRIPTION */}

            <section className="border-b border-border py-9">

              <h2 className="text-2xl font-bold text-secondary">
                About this unit
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-text-secondary">
                {unit.description ||
                  "No description has been provided for this unit."}
              </p>

            </section>

            {/* BUSINESS DESCRIPTION */}

            <section className="border-b border-border py-9">

              <h2 className="text-2xl font-bold text-secondary">
                About the business
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-text-secondary">
                {business.description ||
                  `${business.name} is available through Faaro Bookings.`}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <BusinessInfo
                  label="Contact"
                  value={
                    business.contactPhone
                  }
                />

                <BusinessInfo
                  label="Opening hours"
                  value={
                    business.openHours
                  }
                />

              </div>

            </section>

            {/* LOCATION */}

            <section className="py-9">

              <h2 className="text-2xl font-bold text-secondary">
                Location
              </h2>

              <div className="mt-5 flex items-start gap-4 rounded-2xl bg-surface-soft p-5">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">

                  <MapPin
                    size={20}
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-secondary">
                    {business.city}
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    {unit.address ||
                      business.address}
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================
              BOOKING SIDEBAR
          ================= */}

          <aside>

            <div className="sticky top-28 rounded-[24px] border border-border bg-white p-6 shadow-lg">

              {/* PRICE */}

              <div>

                <span className="text-3xl font-bold text-secondary">
                  ${unit.price}
                </span>

                <span className="text-text-muted">
                  {" "}
                  / {period}
                </span>

              </div>

              {/* =================
                  DATES
              ================= */}

              <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border">

                {/* START */}

                <label className="border-r border-border p-3">

                  <span className="mb-1 block text-[11px] font-bold uppercase text-text-muted">
                    Start date
                  </span>

                  <input
                    type="date"
                    min={
                      getTomorrowDate()
                    }
                    value={
                      bookingData.startDate
                    }
                    onChange={(e) =>
                      setBookingData(
                        (prev) => ({
                          ...prev,

                          startDate:
                            e.target
                              .value,

                          endDate:
                            prev.endDate &&
                            prev.endDate <=
                              e.target
                                .value
                              ? ""
                              : prev.endDate,
                        })
                      )
                    }
                    className="w-full bg-transparent text-sm outline-none"
                  />

                </label>

                {/* END */}

                <label className="p-3">

                  <span className="mb-1 block text-[11px] font-bold uppercase text-text-muted">
                    End date
                  </span>

                  <input
                    type="date"
                    min={
                      bookingData.startDate ||
                      getTomorrowDate()
                    }
                    value={
                      bookingData.endDate
                    }
                    onChange={(e) =>
                      setBookingData(
                        (prev) => ({
                          ...prev,

                          endDate:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="w-full bg-transparent text-sm outline-none"
                  />

                </label>

              </div>

              {/* =================
                  DOCUMENT
              ================= */}

              <div className="mt-5">

                <p className="mb-2 text-sm font-semibold text-secondary">

                  Document

                  <span className="ml-1 font-normal text-text-muted">
                    (optional)
                  </span>

                </p>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border p-4 transition hover:border-primary">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">

                    <FileImage
                      size={19}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-secondary">
                      {document
                        ? document.name
                        : "Upload document image"}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      JPEG, PNG or WebP
                      • max 5MB
                    </p>

                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleDocument
                    }
                    className="hidden"
                  />

                </label>

                {document && (
                  <button
                    type="button"
                    onClick={() =>
                      setDocument(null)
                    }
                    className="mt-2 text-xs font-semibold text-danger"
                  >
                    Remove document
                  </button>
                )}

              </div>

              {/* =================
                  PRICE SUMMARY
              ================= */}

              {duration > 0 && (
                <div className="mt-6 space-y-3">

                  <div className="flex justify-between text-sm text-text-secondary">

                    <span>
                      ${unit.price}
                      {" × "}
                      {duration}
                      {" "}
                      {duration === 1
                        ? period
                        : `${period}s`}
                    </span>

                    <span>
                      ${total}
                    </span>

                  </div>

                  <div className="flex justify-between border-t border-border pt-4 font-bold text-secondary">

                    <span>
                      Total
                    </span>

                    <span>
                      ${total}
                    </span>

                  </div>

                </div>
              )}

              {/* =================
                  CREATE BOOKING
              ================= */}

              <button
                type="button"
                onClick={
                  handleBooking
                }
                disabled={
                  duration === 0 ||
                  bookingLoading
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >

                {bookingLoading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />

                    Creating booking...
                  </>
                ) : duration > 0 ? (
                  "Create Booking"
                ) : (
                  "Select dates"
                )}

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-text-muted">
                After creating your
                booking, you can
                complete payment from
                My Bookings.
              </p>

              {/* INFO */}

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-light p-4">

                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>

                  <p className="text-sm font-semibold text-secondary">
                    Booking first,
                    payment second
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Your booking will
                    first be saved as
                    unpaid. Complete
                    payment from My
                    Bookings to confirm
                    it.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


/* =========================================
   GALLERY
========================================= */

const Gallery = ({
  images,
  title,
  selectedImage,
  setSelectedImage,
  nextImage,
  previousImage,
}) => {
  if (!images.length) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-[24px] bg-surface-soft md:h-[500px]">

        <div className="text-center text-text-muted">

          <ImageOff
            size={42}
            className="mx-auto"
          />

          <p className="mt-3 text-sm">
            No images available
          </p>

        </div>

      </div>
    );
  }

  return (
    <section className="grid gap-3 overflow-hidden rounded-[24px] lg:grid-cols-[2fr_1fr]">

      {/* MAIN IMAGE */}

      <div className="relative h-[350px] overflow-hidden bg-surface-soft md:h-[500px]">

        <img
          src={
            images[
              selectedImage
            ]
          }
          alt={title}
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={
                previousImage
              }
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-secondary shadow transition hover:bg-white"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              onClick={
                nextImage
              }
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-secondary shadow transition hover:bg-white"
            >
              <ChevronRight />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white">
          {selectedImage + 1}
          {" / "}
          {images.length}
        </div>

      </div>

      {/* THUMBNAILS */}

      <div className="hidden grid-cols-2 gap-3 lg:grid">

        {images
          .slice(0, 4)
          .map(
            (
              image,
              index
            ) => (
              <button
                type="button"
                key={`${image}-${index}`}
                onClick={() =>
                  setSelectedImage(
                    index
                  )
                }
                className={`overflow-hidden ${
                  selectedImage ===
                  index
                    ? "ring-4 ring-primary"
                    : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${title} ${
                    index + 1
                  }`}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </button>
            )
          )}

      </div>

    </section>
  );
};


/* =========================================
   QUICK DETAILS
========================================= */

const QuickDetails = ({
  unit,
  category,
}) => {
  if (
    category === "hotel"
  ) {
    const details =
      unit.details?.hotel;

    if (!details) {
      return null;
    }

    return (
      <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-3">

        <InfoCard
          icon={
            <BedDouble />
          }
          title={`${details.beds} ${
            details.beds === 1
              ? "Bed"
              : "Beds"
          }`}
          text={
            details.roomType
          }
        />

        <InfoCard
          icon={<Users />}
          title={`${details.capacity} Guests`}
          text="Maximum capacity"
        />

        <InfoCard
          icon={
            <ShieldCheck />
          }
          title="Available"
          text="Active unit"
        />

      </div>
    );
  }

  if (
    category ===
    "car_rental"
  ) {
    const details =
      unit.details?.car;

    if (!details) {
      return null;
    }

    return (
      <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-3">

        <InfoCard
          icon={<Car />}
          title={`${details.make} ${details.model}`}
          text="Vehicle"
        />

        <InfoCard
          icon={<Users />}
          title={`${details.seats} Seats`}
          text="Passenger capacity"
        />

        <InfoCard
          icon={
            <ShieldCheck />
          }
          title={
            details.plateNumber
          }
          text="Plate number"
        />

      </div>
    );
  }

  if (
    category ===
    "apartment"
  ) {
    const details =
      unit.details
        ?.apartment;

    if (!details) {
      return null;
    }

    return (
      <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-3">

        <InfoCard
          icon={
            <BedDouble />
          }
          title={`${details.bedrooms} Bedrooms`}
          text="Bedrooms"
        />

        <InfoCard
          icon={<Bath />}
          title={`${details.bathrooms} Bathrooms`}
          text="Bathrooms"
        />

        <InfoCard
          icon={<Users />}
          title={`${details.maxGuests} Guests`}
          text="Maximum guests"
        />

      </div>
    );
  }

  return null;
};


/* =========================================
   INFO CARD
========================================= */

const InfoCard = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>

      <div>

        <p className="font-semibold text-secondary">
          {title}
        </p>

        <p className="mt-1 text-xs text-text-muted">
          {text}
        </p>

      </div>

    </div>
  );
};


/* =========================================
   BUSINESS INFO
========================================= */

const BusinessInfo = ({
  label,
  value,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-xl bg-surface-soft p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-secondary">
        {value}
      </p>

    </div>
  );
};


/* =========================================
   CATEGORY BADGE
========================================= */

const CategoryBadge = ({
  category,
}) => {
  const config = {
    hotel: {
      label: "Hotel",
      icon: (
        <Hotel size={15} />
      ),
    },

    car_rental: {
      label: "Car Rental",
      icon: (
        <Car size={15} />
      ),
    },

    apartment: {
      label: "Apartment",
      icon: (
        <Building2
          size={15}
        />
      ),
    },
  };

  const selected =
    config[category];

  if (!selected) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">

      {selected.icon}

      {selected.label}

    </span>
  );
};


/* =========================================
   BUSINESS ICON
========================================= */

const BusinessIcon = ({
  category,
}) => {
  if (
    category ===
    "car_rental"
  ) {
    return (
      <Car size={26} />
    );
  }

  if (
    category ===
    "apartment"
  ) {
    return (
      <Building2 size={26} />
    );
  }

  return (
    <Hotel size={26} />
  );
};


/* =========================================
   LOADING
========================================= */

const LoadingPage = ({
  text,
}) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">

      <div className="text-center">

        <LoaderCircle
          size={40}
          className="mx-auto animate-spin text-primary"
        />

        <p className="mt-4 text-sm text-text-secondary">
          {text}
        </p>

      </div>

    </div>
  );
};


/* =========================================
   TOMORROW
========================================= */

const getTomorrowDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() + 1
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


export default UnitDetails;