import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const hotelDetailsSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: true,
      trim: true,
    },
    beds: {
      type: Number,
      required: true,
      min: 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const carDetailsSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    plateNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  { _id: false }
);

const apartmentDetailsSchema = new mongoose.Schema(
  {
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const unitSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      immutable: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      enum: ["USD"],
      default: "USD",
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    details: {
      hotel: {
        type: hotelDetailsSchema,
        default: undefined,
      },

      car: {
        type: carDetailsSchema,
        default: undefined,
      },

      apartment: {
        type: apartmentDetailsSchema,
        default: undefined,
      },
    },
  }, { timestamps: true, });

unitSchema.index(
  {
    businessId: 1,
    code: 1,
  },
  {
    unique: true,
  }
);

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;