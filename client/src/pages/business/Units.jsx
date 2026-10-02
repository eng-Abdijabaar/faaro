import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BedDouble,
  Building2,
  Car,
  Edit3,
  Hotel,
  ImageOff,
  ImagePlus,
  LoaderCircle,
  Plus,
  Search,
  ShieldOff,
  Users,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import BusinessLayout from "../../components/business/BusinessLayout";
import useBusinessStore from "../../store/businessStore";

const Units = () => {
  const business =
    useBusinessStore(
      (state) => state.business
    );

  const units =
    useBusinessStore(
      (state) => state.units
    );

  const getBusiness =
    useBusinessStore(
      (state) =>
        state.getBusiness
    );

  const getUnits =
    useBusinessStore(
      (state) => state.getUnits
    );

  const createUnit =
    useBusinessStore(
      (state) => state.createUnit
    );

  const updateUnit =
    useBusinessStore(
      (state) => state.updateUnit
    );

  const deactivateUnit =
    useBusinessStore(
      (state) =>
        state.deactivateUnit
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingUnit,
    setEditingUnit,
  ] = useState(null);

  const [
    deactivating,
    setDeactivating,
  ] = useState(null);

  useEffect(() => {
    Promise.all([
      getBusiness(),
      getUnits(),
    ])
      .catch((error) => {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load units"
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, [
    getBusiness,
    getUnits,
  ]);

  const filteredUnits =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return units.filter(
        (unit) => {
          const matchesSearch =
            !query ||
            unit.title
              ?.toLowerCase()
              .includes(query) ||
            unit.code
              ?.toLowerCase()
              .includes(query) ||
            unit.address
              ?.toLowerCase()
              .includes(query);

          const matchesFilter =
            filter === "all" ||
            (filter === "active" &&
              unit.active) ||
            (filter ===
              "inactive" &&
              !unit.active) ||
            (filter ===
              "available" &&
              unit.isAvailable);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      units,
      search,
      filter,
    ]);

  const openCreate = () => {
    setEditingUnit(null);
    setModalOpen(true);
  };

  const openEdit = (unit) => {
    setEditingUnit(unit);
    setModalOpen(true);
  };

  const handleDeactivate =
    async (unit) => {
      try {
        setDeactivating(
          unit._id
        );

        await deactivateUnit(
          unit._id
        );

        toast.success(
          "Unit deactivated"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to deactivate unit"
        );
      } finally {
        setDeactivating(null);
      }
    };

  return (
    <BusinessLayout>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold text-primary">
            Inventory
          </p>

          <h1 className="mt-1 text-3xl font-bold text-secondary">
            Units
          </h1>

          <p className="mt-2 text-text-secondary">
            Manage the units
            customers can book.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          <Plus size={18} />

          Add Unit
        </button>

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
            placeholder="Search units..."
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
            All units
          </option>

          <option value="active">
            Active
          </option>

          <option value="available">
            Available
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

      </div>

      {loading ? (
        <Loading />
      ) : filteredUnits.length ===
        0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-14 text-center">

          <Building2
            size={38}
            className="mx-auto text-primary"
          />

          <h2 className="mt-4 text-xl font-bold text-secondary">
            No units found
          </h2>

          <p className="mt-2 text-text-secondary">
            Create your first
            unit to start taking
            bookings.
          </p>

        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredUnits.map(
            (unit) => (
              <UnitCard
                key={unit._id}
                unit={unit}
                category={
                  business?.category
                }
                onEdit={() =>
                  openEdit(unit)
                }
                onDeactivate={() =>
                  handleDeactivate(
                    unit
                  )
                }
                deactivating={
                  deactivating ===
                  unit._id
                }
              />
            )
          )}

        </div>
      )}

      {modalOpen && (
        <UnitModal
          business={business}
          unit={editingUnit}
          createUnit={
            createUnit
          }
          updateUnit={
            updateUnit
          }
          onClose={() => {
            setModalOpen(false);
            setEditingUnit(null);
          }}
        />
      )}

    </BusinessLayout>
  );
};

const UnitCard = ({
  unit,
  category,
  onEdit,
  onDeactivate,
  deactivating,
}) => {
  const image =
    unit.images?.[0]?.url;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white">

      <div className="relative h-48 bg-surface-soft">

        {image ? (
          <img
            src={image}
            alt={unit.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <ImageOff size={30} />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <CategoryBadge
            category={category}
          />
        </div>

      </div>

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-lg font-bold text-secondary">
              {unit.title}
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              {unit.code}
            </p>
          </div>

          <p className="font-bold text-primary">
            ${unit.price}
          </p>

        </div>

        <UnitMeta
          unit={unit}
          category={category}
        />

        <div className="mt-5 flex flex-wrap gap-2">

          <StatusPill
            active={unit.active}
            trueText="Active"
            falseText="Inactive"
          />

          <StatusPill
            active={
              unit.isAvailable
            }
            trueText="Available"
            falseText="Unavailable"
          />

        </div>

        <div className="mt-5 flex gap-2 border-t border-border pt-5">

          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-secondary"
          >
            <Edit3 size={16} />

            Edit
          </button>

          {unit.active && (
            <button
              onClick={
                onDeactivate
              }
              disabled={
                deactivating
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-danger/30 py-3 text-sm font-semibold text-danger disabled:opacity-50"
            >
              <ShieldOff
                size={16}
              />

              {deactivating
                ? "Deactivating..."
                : "Deactivate"}
            </button>
          )}

        </div>

      </div>

    </article>
  );
};

const UnitModal = ({
  business,
  unit,
  createUnit,
  updateUnit,
  onClose,
}) => {
  const isEdit =
    Boolean(unit);

  const category =
    business?.category;

  const initialDetails =
    getInitialDetails(
      category,
      unit
    );

  const [form, setForm] =
    useState({
      title:
        unit?.title || "",

      description:
        unit?.description || "",

      address:
        unit?.address || "",

      price:
        unit?.price || "",

      active:
        unit?.active ?? true,

      ...initialDetails,
    });

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const change = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
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

      data.append(
        "title",
        form.title
      );

      data.append(
        "description",
        form.description
      );

      data.append(
        "address",
        form.address
      );

      data.append(
        "price",
        form.price
      );

      data.append(
        "active",
        String(form.active)
      );

      data.append(
        "details",
        JSON.stringify(
          buildDetails(
            category,
            form
          )
        )
      );

      images.forEach(
        (image) =>
          data.append(
            "images",
            image
          )
      );

      if (isEdit) {
        await updateUnit(
          unit._id,
          data
        );

        toast.success(
          "Unit updated successfully"
        );
      } else {
        await createUnit(data);

        toast.success(
          "Unit created successfully"
        );
      }

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Unable to save unit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-2xl font-bold text-secondary">
              {isEdit
                ? "Edit Unit"
                : "Add Unit"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {formatCategory(
                category
              )}
            </p>
          </div>

          <button
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

          <Input
            name="title"
            label="Title"
            value={form.title}
            onChange={change}
          />

          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              name="price"
              label="Price (USD)"
              type="number"
              min="1"
              value={form.price}
              onChange={change}
            />

            <Input
              name="address"
              label="Address"
              value={form.address}
              onChange={change}
            />

          </div>

          <label className="block">

            <span className="mb-2 block text-sm font-semibold text-secondary">
              Description
            </span>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={change}
              rows={4}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
            />

          </label>

          <CategoryFields
            category={category}
            form={form}
            change={change}
          />

          {isEdit && (
            <label className="flex items-center gap-3 rounded-xl bg-surface-soft p-4">

              <input
                type="checkbox"
                name="active"
                checked={
                  form.active
                }
                onChange={change}
              />

              <span className="font-semibold text-secondary">
                Unit active
              </span>

            </label>
          )}

          <label className="block cursor-pointer rounded-xl border border-dashed border-border p-5">

            <div className="flex items-center gap-3">

              <ImagePlus className="text-primary" />

              <div>
                <p className="font-semibold text-secondary">
                  Unit Images
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
              <p className="mt-3 text-sm font-semibold text-primary">
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
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Unit"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

const CategoryFields = ({
  category,
  form,
  change,
}) => {
  if (category === "hotel") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">

        <Input
          label="Room Type"
          name="roomType"
          value={form.roomType}
          onChange={change}
        />

        <Input
          label="Beds"
          name="beds"
          type="number"
          min="1"
          value={form.beds}
          onChange={change}
        />

        <Input
          label="Capacity"
          name="capacity"
          type="number"
          min="1"
          value={
            form.capacity
          }
          onChange={change}
        />

      </div>
    );
  }

  if (
    category ===
    "car_rental"
  ) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">

        <Input
          label="Make"
          name="make"
          value={form.make}
          onChange={change}
        />

        <Input
          label="Model"
          name="model"
          value={form.model}
          onChange={change}
        />

        <Input
          label="Seats"
          name="seats"
          type="number"
          min="1"
          value={form.seats}
          onChange={change}
        />

        <Input
          label="Plate Number"
          name="plateNumber"
          value={
            form.plateNumber
          }
          onChange={change}
        />

      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">

      <Input
        label="Bedrooms"
        name="bedrooms"
        type="number"
        min="1"
        value={form.bedrooms}
        onChange={change}
      />

      <Input
        label="Bathrooms"
        name="bathrooms"
        type="number"
        min="1"
        value={
          form.bathrooms
        }
        onChange={change}
      />

      <Input
        label="Max Guests"
        name="maxGuests"
        type="number"
        min="1"
        value={
          form.maxGuests
        }
        onChange={change}
      />

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

const getInitialDetails = (
  category,
  unit
) => {
  if (category === "hotel") {
    return {
      roomType:
        unit?.details?.hotel
          ?.roomType || "",

      beds:
        unit?.details?.hotel
          ?.beds || "",

      capacity:
        unit?.details?.hotel
          ?.capacity || "",
    };
  }

  if (
    category ===
    "car_rental"
  ) {
    return {
      make:
        unit?.details?.car
          ?.make || "",

      model:
        unit?.details?.car
          ?.model || "",

      seats:
        unit?.details?.car
          ?.seats || "",

      plateNumber:
        unit?.details?.car
          ?.plateNumber || "",
    };
  }

  return {
    bedrooms:
      unit?.details?.apartment
        ?.bedrooms || "",

    bathrooms:
      unit?.details?.apartment
        ?.bathrooms || "",

    maxGuests:
      unit?.details?.apartment
        ?.maxGuests || "",
  };
};

const buildDetails = (
  category,
  form
) => {
  if (category === "hotel") {
    return {
      hotel: {
        roomType:
          form.roomType,

        beds:
          Number(form.beds),

        capacity:
          Number(
            form.capacity
          ),
      },
    };
  }

  if (
    category ===
    "car_rental"
  ) {
    return {
      car: {
        make: form.make,
        model: form.model,

        seats:
          Number(form.seats),

        plateNumber:
          form.plateNumber,
      },
    };
  }

  return {
    apartment: {
      bedrooms:
        Number(
          form.bedrooms
        ),

      bathrooms:
        Number(
          form.bathrooms
        ),

      maxGuests:
        Number(
          form.maxGuests
        ),
    },
  };
};

const UnitMeta = ({
  unit,
  category,
}) => {
  if (category === "hotel") {
    return (
      <p className="mt-4 text-sm text-text-secondary">
        <BedDouble
          size={15}
          className="mr-2 inline"
        />

        {
          unit.details?.hotel
            ?.beds
        }{" "}
        beds •{" "}
        {
          unit.details?.hotel
            ?.capacity
        }{" "}
        guests
      </p>
    );
  }

  if (
    category ===
    "car_rental"
  ) {
    return (
      <p className="mt-4 text-sm text-text-secondary">

        <Car
          size={15}
          className="mr-2 inline"
        />

        {
          unit.details?.car
            ?.make
        }{" "}
        {
          unit.details?.car
            ?.model
        }
      </p>
    );
  }

  return (
    <p className="mt-4 text-sm text-text-secondary">

      <Users
        size={15}
        className="mr-2 inline"
      />

      {
        unit.details
          ?.apartment
          ?.bedrooms
      }{" "}
      bedrooms •{" "}
      {
        unit.details
          ?.apartment
          ?.maxGuests
      }{" "}
      guests

    </p>
  );
};

const CategoryBadge = ({
  category,
}) => {
  const data = {
    hotel: [
      "Hotel",
      <Hotel
        key="hotel"
        size={14}
      />,
    ],

    car_rental: [
      "Car Rental",
      <Car
        key="car"
        size={14}
      />,
    ],

    apartment: [
      "Apartment",
      <Building2
        key="apartment"
        size={14}
      />,
    ],
  };

  const item =
    data[category];

  if (!item) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow">
      {item[1]}
      {item[0]}
    </span>
  );
};

const StatusPill = ({
  active,
  trueText,
  falseText,
}) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      active
        ? "bg-green-50 text-green-700"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    {active
      ? trueText
      : falseText}
  </span>
);

const Loading = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <LoaderCircle className="animate-spin text-primary" />
  </div>
);

const formatCategory = (
  category
) =>
  category === "car_rental"
    ? "Car Rental"
    : category === "apartment"
      ? "Apartment"
      : "Hotel";

export default Units;