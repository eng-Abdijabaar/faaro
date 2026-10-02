import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import {
  Building2,
  CalendarDays,
  Car,
  ChevronDown,
  Filter,
  Hotel,
  ImageOff,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import useCustomerStore from "../store/customerStore";


const VALID_CATEGORIES = [
  "hotel",
  "car_rental",
  "apartment",
];


const Explore = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  /* ============================
     URL PARAMS
  ============================ */

  const requestedCategory =
    searchParams.get("category");

  const categoryFromUrl =
    VALID_CATEGORIES.includes(
      requestedCategory
    )
      ? requestedCategory
      : "hotel";

  const cityFromUrl =
    searchParams.get("city") || "";

  const startDateFromUrl =
    searchParams.get("startDate") || "";

  const endDateFromUrl =
    searchParams.get("endDate") || "";

  /* ============================
     CUSTOMER STORE
  ============================ */

  const units = useCustomerStore(
    (state) => state.units
  );

  const businesses = useCustomerStore(
    (state) => state.businesses
  );

  const getUnits = useCustomerStore(
    (state) => state.getUnits
  );

  const getBusinesses =
    useCustomerStore(
      (state) => state.getBusinesses
    );

  /* ============================
     LOCAL STATE
  ============================ */

  const [
    showMobileFilters,
    setShowMobileFilters,
  ] = useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [searchData, setSearchData] =
    useState({
      city: cityFromUrl,
      startDate: startDateFromUrl,
      endDate: endDateFromUrl,
    });

  const [filters, setFilters] =
    useState({
      minPrice: "",
      maxPrice: "",
    });

  const [sort, setSort] =
    useState("recommended");

  /* ============================
     FETCH DATA
  ============================ */

  useEffect(() => {
    const loadExploreData = async () => {
      try {
        setPageLoading(true);
        setLoadError("");

        await Promise.all([
          getUnits(),
          getBusinesses(),
        ]);
      } catch (error) {
        setLoadError(
          error.response?.data?.message ||
            "Unable to load available units"
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadExploreData();
  }, [getUnits, getBusinesses]);

  /* ============================
     BUSINESS MAP
  ============================ */

  const businessMap = useMemo(() => {
    return new Map(
      businesses.map((business) => [
        business._id,
        business,
      ])
    );
  }, [businesses]);

  /* ============================
     COMBINE UNIT + BUSINESS
  ============================ */

  const listings = useMemo(() => {
    return units
      .filter(
        (unit) =>
          unit.active !== false
      )
      .map((unit) => {
        const business =
          businessMap.get(
            String(unit.businessId)
          );

        return {
          ...unit,

          business,

          category:
            business?.category || "",

          city:
            business?.city || "",

          businessName:
            business?.name || "",

          image:
            unit.images?.[0]?.url ||
            null,
        };
      });
  }, [units, businessMap]);

  /* ============================
     FILTER + SORT
  ============================ */

  const filteredListings =
    useMemo(() => {
      let result = listings.filter(
        (item) =>
          item.category ===
          categoryFromUrl
      );

      if (searchData.city.trim()) {
        const searchCity =
          searchData.city
            .trim()
            .toLowerCase();

        result = result.filter(
          (item) =>
            item.city
              ?.toLowerCase()
              .includes(searchCity)
        );
      }

      if (filters.minPrice) {
        result = result.filter(
          (item) =>
            Number(item.price) >=
            Number(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        result = result.filter(
          (item) =>
            Number(item.price) <=
            Number(filters.maxPrice)
        );
      }

      if (sort === "price-low") {
        result = [...result].sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
      }

      if (sort === "price-high") {
        result = [...result].sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
      }

      if (sort === "newest") {
        result = [...result].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
      }

      return result;
    }, [
      listings,
      categoryFromUrl,
      searchData.city,
      filters.minPrice,
      filters.maxPrice,
      sort,
    ]);

  /* ============================
     CATEGORY
  ============================ */

  const changeCategory = (
    category
  ) => {
    const params =
      new URLSearchParams(
        searchParams
      );

    params.set(
      "category",
      category
    );

    navigate(
      `/explore?${params.toString()}`
    );
  };

  /* ============================
     SEARCH
  ============================ */

  const handleSearch = (e) => {
    e.preventDefault();

    const params =
      new URLSearchParams();

    params.set(
      "category",
      categoryFromUrl
    );

    if (searchData.city.trim()) {
      params.set(
        "city",
        searchData.city.trim()
      );
    }

    if (searchData.startDate) {
      params.set(
        "startDate",
        searchData.startDate
      );
    }

    if (searchData.endDate) {
      params.set(
        "endDate",
        searchData.endDate
      );
    }

    navigate(
      `/explore?${params.toString()}`
    );
  };

  /* ============================
     RESET FILTERS
  ============================ */

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
    });
  };

  /* ============================
     UNIT DETAILS LINK
  ============================ */

  const getUnitLink = (id) => {
    const params =
      new URLSearchParams();

    if (searchData.startDate) {
      params.set(
        "startDate",
        searchData.startDate
      );
    }

    if (searchData.endDate) {
      params.set(
        "endDate",
        searchData.endDate
      );
    }

    const query =
      params.toString();

    return query
      ? `/unit/${id}?${query}`
      : `/unit/${id}`;
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* =====================
          NAVBAR
      ===================== */}

      <Navbar />

      {/* =====================
          HEADER
      ===================== */}

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Discover Faaro
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-secondary md:text-5xl">
            Find your perfect booking
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
            Browse available hotels,
            rental cars and apartments
            based on your destination and
            budget.
          </p>

          {/* CATEGORY TABS */}

          <div className="mt-9 flex gap-2 overflow-x-auto">

            <CategoryTab
              active={
                categoryFromUrl ===
                "hotel"
              }
              icon={
                <Hotel size={18} />
              }
              label="Hotels"
              onClick={() =>
                changeCategory(
                  "hotel"
                )
              }
            />

            <CategoryTab
              active={
                categoryFromUrl ===
                "car_rental"
              }
              icon={
                <Car size={18} />
              }
              label="Cars"
              onClick={() =>
                changeCategory(
                  "car_rental"
                )
              }
            />

            <CategoryTab
              active={
                categoryFromUrl ===
                "apartment"
              }
              icon={
                <Building2
                  size={18}
                />
              }
              label="Apartments"
              onClick={() =>
                changeCategory(
                  "apartment"
                )
              }
            />

          </div>
        </div>
      </section>

      {/* =====================
          SEARCH
      ===================== */}

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">

          <form
            onSubmit={handleSearch}
            className="grid gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm lg:grid-cols-[1.4fr_1fr_1fr_auto]"
          >

            {/* CITY */}

            <SearchInput
              icon={
                <MapPin size={19} />
              }
              label="Location"
            >
              <input
                type="text"
                placeholder="Search city"
                value={
                  searchData.city
                }
                onChange={(e) =>
                  setSearchData(
                    (prev) => ({
                      ...prev,
                      city:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-text-muted"
              />
            </SearchInput>

            {/* START DATE */}

            <SearchInput
              icon={
                <CalendarDays
                  size={19}
                />
              }
              label="Start date"
            >
              <input
                type="date"
                value={
                  searchData.startDate
                }
                onChange={(e) =>
                  setSearchData(
                    (prev) => ({
                      ...prev,
                      startDate:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full bg-transparent text-sm outline-none"
              />
            </SearchInput>

            {/* END DATE */}

            <SearchInput
              icon={
                <CalendarDays
                  size={19}
                />
              }
              label="End date"
            >
              <input
                type="date"
                value={
                  searchData.endDate
                }
                onChange={(e) =>
                  setSearchData(
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
            </SearchInput>

            <button
              type="submit"
              className="flex min-h-16 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-white transition hover:bg-primary-dark"
            >
              <Search size={19} />

              Search
            </button>

          </form>
        </div>
      </section>

      {/* =====================
          MAIN
      ===================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">

        {/* TOP BAR */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h2 className="text-2xl font-bold text-secondary">
              {getCategoryTitle(
                categoryFromUrl
              )}
            </h2>

            {!pageLoading && (
              <p className="mt-1 text-sm text-text-secondary">
                {
                  filteredListings.length
                }{" "}
                results found
              </p>
            )}

          </div>

          <div className="flex items-center gap-3">

            {/* MOBILE FILTER */}

            <button
              onClick={() =>
                setShowMobileFilters(
                  true
                )
              }
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary lg:hidden"
            >
              <Filter size={17} />

              Filters
            </button>

            {/* SORT */}

            <div className="relative">

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value
                  )
                }
                className="appearance-none rounded-xl border border-border bg-white py-3 pl-4 pr-10 text-sm font-medium text-secondary outline-none focus:border-primary"
              >
                <option value="recommended">
                  Recommended
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="newest">
                  Newest
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* =====================
              FILTER SIDEBAR
          ===================== */}

          <aside className="hidden lg:block">

            <FilterPanel
              filters={filters}
              setFilters={
                setFilters
              }
              resetFilters={
                resetFilters
              }
            />

          </aside>

          {/* =====================
              RESULTS
          ===================== */}

          <section>

            {pageLoading ? (
              <ListingSkeletons />
            ) : loadError ? (
              <ErrorState
                message={loadError}
                onRetry={() =>
                  window.location.reload()
                }
              />
            ) : filteredListings.length >
              0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredListings.map(
                  (listing) => (
                    <ListingCard
                      key={
                        listing._id
                      }
                      listing={
                        listing
                      }
                      detailsUrl={getUnitLink(
                        listing._id
                      )}
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyState
                resetFilters={
                  resetFilters
                }
              />
            )}

          </section>
        </div>
      </main>

      {/* =====================
          MOBILE FILTER
      ===================== */}

      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <button
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setShowMobileFilters(
                false
              )
            }
            aria-label="Close filters"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <SlidersHorizontal
                  size={20}
                />

                <h3 className="text-xl font-bold text-secondary">
                  Filters
                </h3>

              </div>

              <button
                onClick={() =>
                  setShowMobileFilters(
                    false
                  )
                }
                className="rounded-full bg-surface-soft p-2"
              >
                <X size={19} />
              </button>

            </div>

            <FilterPanel
              filters={filters}
              setFilters={
                setFilters
              }
              resetFilters={
                resetFilters
              }
              mobile
            />

            <button
              onClick={() =>
                setShowMobileFilters(
                  false
                )
              }
              className="mt-6 w-full rounded-xl bg-primary py-4 font-semibold text-white"
            >
              Show{" "}
              {
                filteredListings.length
              }{" "}
              results
            </button>

          </div>
        </div>
      )}

    </div>
  );
};


/* =================================
   FILTER PANEL
================================= */

const FilterPanel = ({
  filters,
  setFilters,
  resetFilters,
  mobile = false,
}) => {
  return (
    <div
      className={
        mobile
          ? ""
          : "sticky top-28 rounded-2xl border border-border bg-white p-6"
      }
    >

      {!mobile && (
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={18}
            />

            <h3 className="font-bold text-secondary">
              Filters
            </h3>

          </div>

          <button
            onClick={
              resetFilters
            }
            className="text-xs font-semibold text-primary"
          >
            Reset
          </button>

        </div>
      )}

      <div>

        <h4 className="mb-3 text-sm font-semibold text-secondary">
          Price range
        </h4>

        <div className="grid grid-cols-2 gap-2">

          <input
            type="number"
            min="0"
            placeholder="Min"
            value={
              filters.minPrice
            }
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  minPrice:
                    e.target.value,
                })
              )
            }
            className="min-w-0 rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={
              filters.maxPrice
            }
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  maxPrice:
                    e.target.value,
                })
              )
            }
            className="min-w-0 rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary"
          />

        </div>
      </div>

      {mobile && (
        <button
          onClick={
            resetFilters
          }
          className="mt-6 text-sm font-semibold text-primary"
        >
          Reset all filters
        </button>
      )}

    </div>
  );
};


/* =================================
   LISTING CARD
================================= */

const ListingCard = ({
  listing,
  detailsUrl,
}) => {
  const details =
    getUnitDetails(listing);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}

      <div className="relative h-60 overflow-hidden bg-surface-soft">

        <Link to={detailsUrl}>

          {listing.image ? (
            <img
              src={
                listing.image
              }
              alt={
                listing.title
              }
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-text-muted">

              <ImageOff
                size={30}
              />

              <span className="mt-2 text-sm">
                No image
              </span>

            </div>
          )}

        </Link>

        {/* CATEGORY */}

        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-secondary">
          {formatCategory(
            listing.category
          )}
        </div>

      </div>

      {/* BODY */}

      <div className="p-5">

        {/* LOCATION */}

        <div className="flex items-center gap-1.5 text-sm text-text-secondary">

          <MapPin size={15} />

          {listing.city ||
            listing.address ||
            "Location unavailable"}

        </div>

        {/* TITLE */}

        <Link to={detailsUrl}>

          <h3 className="mt-2 text-lg font-bold text-secondary transition group-hover:text-primary">
            {listing.title}
          </h3>

        </Link>

        {/* BUSINESS */}

        {listing.businessName && (
          <p className="mt-1 text-xs font-medium text-primary">
            {
              listing.businessName
            }
          </p>
        )}

        {/* DESCRIPTION */}

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-text-secondary">
          {listing.description ||
            "No description provided."}
        </p>

        {/* DETAILS */}

        {details.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">

            {details.map(
              (detail) => (
                <span
                  key={detail}
                  className="rounded-lg bg-surface-soft px-2.5 py-1.5 text-xs font-medium text-text-secondary"
                >
                  {detail}
                </span>
              )
            )}

          </div>
        )}

        {/* PRICE */}

        <div className="mt-5 flex items-end justify-between border-t border-border pt-5">

          <div>

            <p className="text-xs text-text-muted">
              Price
            </p>

            <span className="text-2xl font-bold text-secondary">
              $
              {listing.price}
            </span>

            <span className="ml-1 text-xs font-medium text-text-muted">
              {listing.currency ||
                "USD"}
            </span>

          </div>

          <Link
            to={detailsUrl}
            className="rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            View details
          </Link>

        </div>
      </div>
    </article>
  );
};


/* =================================
   CATEGORY TAB
================================= */

const CategoryTab = ({
  active,
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition ${
        active
          ? "bg-primary text-white shadow-sm"
          : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"
      }`}
    >
      {icon}

      {label}
    </button>
  );
};


/* =================================
   SEARCH INPUT
================================= */

const SearchInput = ({
  icon,
  label,
  children,
}) => {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-xl border border-border px-4">

      <div className="text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="mb-1 text-xs font-semibold text-text-muted">
          {label}
        </p>

        {children}

      </div>
    </div>
  );
};


/* =================================
   LOADING
================================= */

const ListingSkeletons = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-white"
        >

          <div className="h-60 animate-pulse bg-surface-soft" />

          <div className="space-y-4 p-5">

            <div className="h-4 w-1/3 animate-pulse rounded bg-surface-soft" />

            <div className="h-6 w-3/4 animate-pulse rounded bg-surface-soft" />

            <div className="h-4 w-full animate-pulse rounded bg-surface-soft" />

            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-soft" />

            <div className="h-12 animate-pulse rounded bg-surface-soft" />

          </div>
        </div>
      ))}

    </div>
  );
};


/* =================================
   EMPTY STATE
================================= */

const EmptyState = ({
  resetFilters,
}) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-10 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">

        <Search size={27} />

      </div>

      <h3 className="mt-5 text-xl font-bold text-secondary">
        No results found
      </h3>

      <p className="mt-2 max-w-md text-text-secondary">
        Try changing your
        location, category or
        price range.
      </p>

      <button
        onClick={
          resetFilters
        }
        className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white"
      >
        Clear filters
      </button>

    </div>
  );
};


/* =================================
   ERROR STATE
================================= */

const ErrorState = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-10 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-danger">

        <X size={26} />

      </div>

      <h3 className="mt-5 text-xl font-bold text-secondary">
        Unable to load listings
      </h3>

      <p className="mt-2 max-w-md text-text-secondary">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white"
      >
        Try Again
      </button>

    </div>
  );
};


/* =================================
   UNIT DETAILS
================================= */

const getUnitDetails = (
  listing
) => {
  const details = [];

  if (listing.category === "hotel") {
    const hotel =
      listing.details?.hotel;

    if (hotel?.roomType) {
      details.push(
        hotel.roomType
      );
    }

    if (hotel?.beds) {
      details.push(
        `${hotel.beds} ${
          hotel.beds === 1
            ? "bed"
            : "beds"
        }`
      );
    }

    if (hotel?.capacity) {
      details.push(
        `${hotel.capacity} guests`
      );
    }
  }

  if (
    listing.category ===
    "car_rental"
  ) {
    const car =
      listing.details?.car;

    if (
      car?.make ||
      car?.model
    ) {
      details.push(
        `${car?.make || ""} ${
          car?.model || ""
        }`.trim()
      );
    }

    if (car?.seats) {
      details.push(
        `${car.seats} seats`
      );
    }
  }

  if (
    listing.category ===
    "apartment"
  ) {
    const apartment =
      listing.details
        ?.apartment;

    if (
      apartment?.bedrooms
    ) {
      details.push(
        `${apartment.bedrooms} bedrooms`
      );
    }

    if (
      apartment?.bathrooms
    ) {
      details.push(
        `${apartment.bathrooms} bathrooms`
      );
    }

    if (
      apartment?.maxGuests
    ) {
      details.push(
        `${apartment.maxGuests} guests`
      );
    }
  }

  return details.slice(0, 3);
};


/* =================================
   HELPERS
================================= */

const formatCategory = (
  category
) => {
  if (
    category === "car_rental"
  ) {
    return "Car Rental";
  }

  if (
    category === "apartment"
  ) {
    return "Apartment";
  }

  return "Hotel";
};


const getCategoryTitle = (
  category
) => {
  if (
    category === "car_rental"
  ) {
    return "Available Cars";
  }

  if (
    category === "apartment"
  ) {
    return "Available Apartments";
  }

  return "Available Hotels";
};


export default Explore;