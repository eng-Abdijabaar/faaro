import Unit from "../models/Unit.js";
import Business from "../models/Business.js";
import Booking from "../models/Booking.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import uploadImages from "../lib/uploadImgs.js";
import { v4 as uuidv4 } from "uuid";


// @route  POST /api/business/units/
// @access Private/Owner
export const createUnit = asyncHandler(async (req, res) => {
  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (business.status !== "active") {
    res.status(403);
    throw new Error("This business is suspended");
  }

  const body = req.body ?? {};
  const price = Number(body.price);

  if (!Number.isFinite(price) || price < 1) {
    res.status(400);
    throw new Error("Price must be at least 1 USD");
  }

  let details = body.details;

  if (typeof details === "string") {
    try {
      details = JSON.parse(details);
    } catch {
      res.status(400);
      throw new Error("Details must be valid JSON");
    }
  }

  const detailKey = business.category === "car_rental" ? "car" : business.category;

  if ( !details?.[detailKey] || typeof details[detailKey] !== "object" || Array.isArray(details[detailKey]) ) {
    res.status(400);
    throw new Error(`Please provide details.${detailKey}`);
  }

  const unit = new Unit({
    businessId: business._id,
    code: uuidv4(),
    title: body.title,
    description: body.description,
    address: body.address,
    price,
    currency: "USD",
    active: body.active ?? true,
    details: { [detailKey]: details[detailKey] },
  });

  await unit.validate();

  const existingUnit = await Unit.exists({
    businessId: business._id,
    code: unit.code,
  });

  if (existingUnit) {
    res.status(409);
    throw new Error("This unit code already exists in your business");
  }

  unit.images = await uploadImages(req.files ?? []);
  await unit.save();

  res.status(201).json({
    success: true,
    message: "Unit created successfully",
    data: unit,
  });
});

// @route  PATCH /api/business/units/:id
// @access Private/Owner
export const updateUnit = asyncHandler(async (req, res) => {
  const unitId = req.params.id;

  if (!mongoose.isObjectIdOrHexString(unitId)) {
    res.status(400);
    throw new Error("Invalid unit ID");
  }

  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (business.status !== "active") {
    res.status(403);
    throw new Error("This business is suspended");
  }

  const unit = await Unit.findOne({
    _id: unitId,
    businessId: business._id,
  });

  if (!unit) {
    res.status(404);
    throw new Error("Unit not found");
  }

  const body = req.body ?? {};

  for (const field of [
    "code",
    "title",
    "description",
    "address",
    "active",
  ]) {
    if (body[field] !== undefined) {
      unit[field] = body[field];
    }
  }

  if (body.price !== undefined) {
    const price = Number(body.price);

    if (!Number.isFinite(price) || price < 1) {
      res.status(400);
      throw new Error("Price must be at least 1 USD");
    }

    unit.price = price;
  }

  if (body.details !== undefined) {
    let details = body.details;

    if (typeof details === "string") {
      try {
        details = JSON.parse(details);
      } catch {
        res.status(400);
        throw new Error("Details must be valid JSON");
      }
    }

    const detailKey =
      business.category === "car_rental" ? "car" : business.category;

    if (
      !details?.[detailKey] ||
      typeof details[detailKey] !== "object" ||
      Array.isArray(details[detailKey])
    ) {
      res.status(400);
      throw new Error(`Please provide details.${detailKey}`);
    }

    unit.details = {
      [detailKey]: {
        ...unit.details?.[detailKey]?.toObject(),
        ...details[detailKey],
      },
    };
  }

  await unit.validate();

  if (body.code !== undefined) {
    const existingUnit = await Unit.exists({
      businessId: business._id,
      code: unit.code,
      _id: { $ne: unit._id },
    });

    if (existingUnit) {
      res.status(409);
      throw new Error("This unit code already exists in your business");
    }
  }

  const images = await uploadImages(req.files ?? []);
  unit.images.push(...images);

  await unit.save();

  res.status(200).json({
    success: true,
    message: "Unit updated successfully",
    data: unit,
  });
});

// @route  DELETE /api/business/units/:id
// @access Private/Owner
export const deleteUnit = asyncHandler(async (req, res) => {
  const unitId = req.params.id;

  if (!mongoose.isObjectIdOrHexString(unitId)) {
    res.status(400);
    throw new Error("Invalid unit ID");
  }

  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const unit = await Unit.findOne({
    _id: unitId,
    businessId: business._id,
  });

  if (!unit) {
    res.status(404);
    throw new Error("Unit not found");
  }

  if (unit.active) {
    unit.active = false;
    await unit.save();
  }

  res.status(200).json({
    success: true,
    message: "Unit deactivated successfully",
    data: unit,
  });
});

// @route  GET /api/business/booking
// @access Private/Owner
export const getAllBookings = asyncHandler(async (req, res) => {
  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const bookings = await Booking.find({
    businessId: business._id,
    isValid: true,
  })
    .populate("unitId", "code title price currency")
    .populate("customerId", "fullName email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

// @route  GET /api/business/booking/:id
// @access Private/Owner
export const getBookingById = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  if (!mongoose.isObjectIdOrHexString(bookingId)) {
    res.status(400);
    throw new Error("Invalid booking ID");
  }

  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    businessId: business._id,
    isValid: true,
  })
    .populate("unitId", "code title price currency")
    .populate("customerId", "fullName email phone");

  if (!booking) {
    res.status(404);
    throw new Error("Paid booking not found");
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @route  POST /api/business/check-booking
// @access Private/Owner
export const CheckBooking = asyncHandler(async (req, res) => {
  const { booking_code } = req.body ?? {};


  if (typeof booking_code !== "string" || !booking_code.trim()) {
    res.status(400);
    throw new Error("Booking code is required");
  }

  const business = await Business.findOne({ ownerId: req.user._id });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const booking = await Booking.findOne({
    code: booking_code,
    businessId: business._id,
    isValid: true,
  })
    .populate("unitId", "code title")
    .populate("customerId", "fullName email phone");

  if (!booking) {
    res.status(404);
    throw new Error("Paid booking not found");
  }

  if (booking.status !== "progress") {
    res.status(400);
    throw new Error("This booking is cancelled or expired");
  }

  if (booking.endDate <= new Date()) {
    res.status(400);
    throw new Error("This booking has expired");
  }

  res.status(200).json({
    success: true,
    message: "Booking verified successfully",
    data: booking,
  });
});

// @route  GET /api/business/profile
// @access Private/Owner
export const getMyBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findOne({
    ownerId: req.user._id,
  });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  res.status(200).json({
    success: true,
    data: business,
  });
});


// @route  GET /api/business/units
// @access Private/Owner
export const getMyUnits = asyncHandler(async (req, res) => {
  const business = await Business.findOne({
    ownerId: req.user._id,
  });

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const units = await Unit.find({
    businessId: business._id,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: units,
  });
});