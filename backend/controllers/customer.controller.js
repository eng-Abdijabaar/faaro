import mongoose from "mongoose";
import Unit from "../models/Unit.js";
import User from "../models/User.js";
import Business from "../models/Business.js";
import Booking from "../models/Booking.js";
import asyncHandler from "express-async-handler"
import uploadImages from "../lib/uploadImgs.js";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import Review from "../models/review.js";
import Refund from "../models/Refund.js";

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// @route  GET /api/customer/units
// @access Private/customer
export const getAllUnits = asyncHandler(async (req, res) => {
    const allunits = await Unit.find();

    if(allunits.length === 0) {
        throw createError(400, 'No units founded')
    }

    res.status(200).json({
        success: true,
        message: 'all units retrived',
        data: allunits
    })

});

// @route  GET /api/customer/businesses
// @access Private/customer
export const getAllBusinesses = asyncHandler(async (req, res) => {
    const allBusinesses = await Business.find();

    if(allBusinesses.length === 0) {
        throw createError(400, 'No business founded')
    }

    res.status(200).json({
        success: true,
        data: allBusinesses
    })

});

// @route  GET /api/customer/units/:id
// @access Private/customer
export const getUnitById = asyncHandler(async (req, res) => {
    const unitId = req.params.id

    if(!mongoose.Types.ObjectId.isValid(unitId)) {
        throw createError(400, 'invalid id')
    }

    const unit = await Unit.findById(unitId)

    if(!unit) {
        throw createError(400, 'unit not found')
    }

    res.status(200).json({
        success: true,
        data: unit
    })

});

// @route  GET /api/customer/business/:id
// @access Private/customer
export const getBusinessById = asyncHandler(async (req, res) => {
    const businessId = req.params.id

    if(!mongoose.Types.ObjectId.isValid(businessId)) {
        throw createError(400, 'invalid business id')
    }

    const business = await Business.findById(businessId)

    if(!business) {
        throw createError(400, 'business not found')
    }

    res.status(200).json({
        success: true,
        data: business
    })

});

// @route  POST /api/customer/booking
// @access Private/customer
export const createBooking = asyncHandler(async (req, res) => {
    const { unitId, businessId, startDate, endDate, } = req.body || {};

    if (req.user.role !== "customer") {
        throw createError(403, "Only customers can create bookings");
    }

    if (!unitId || !businessId || !startDate || !endDate) {
        throw createError(400, "Please provide all required fields");
    }

    if ( !mongoose.isObjectIdOrHexString(unitId) || !mongoose.isObjectIdOrHexString(businessId) ) {
        throw createError(400, "Invalid unit or business ID");
    }

    if (typeof startDate !== "string" || typeof endDate !== "string") {
        throw createError(400, "Start and end dates must be date strings");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw createError(400, "Invalid start or end date");
    }

    if (start >= end) {
        throw createError(400, "End date must be after start date");
    }

    if (start < new Date()) {
        throw createError(400, "Start date cannot be in the past");
    }

    const files = req.file ? [req.file] : (req.files || []);

    if (!Array.isArray(files) || files.length > 1) {
        throw createError(400, "Upload only one document image");
    }

    const unit = await Unit.findById(unitId);

    if (!unit) {
        throw createError(404, "Unit not found");
    }

    if (!unit.active) {
        throw createError(400, "This unit is not active for booking");
    }

    if (!unit.isAvailable) {
        throw createError(400, "This unit is not available for booking");
    }

    if (unit.businessId.toString() !== businessId.toLowerCase()) {
        throw createError(400, "This unit does not belong to this business");
    }

    const business = await Business.findById(businessId);

    if (!business) {
        throw createError(404, "Business not found");
    }

    if (business.status !== "active") {
        throw createError(400, "This business is suspended");
    }

    const overlappingBooking = await Booking.exists({
        unitId: unit._id,
        status: "progress",
        startDate: { $lt: end },
        endDate: { $gt: start },
    });

    if (overlappingBooking) {
        throw createError(409, "This unit is already booked for these dates");
    }

    let bookingDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let document;
    let booking;

    try {
        if (files.length === 1) {
            [document] = await uploadImages(files);
        }

        booking = await Booking.create({
            unitId: unit._id,
            businessId: business._id,
            customerId: req.user._id,
            code: uuidv4(),
            price: unit.price * bookingDays,
            document,
            startDate: start,
            endDate: end,
            isValid: false,
        });
    } catch (error) {
        if (document?.publicId) {
            await cloudinary.uploader.destroy(document.publicId).catch(() => {
                console.error("Could not remove the uploaded booking document");
            });
        }

        throw error;
    }

    return res.status(201).json({
        success: true,
        message: "Booking created and awaiting validation",
        data: booking,
    });
});

// @route  POST /api/customer/reviews
// @access Private/customer
export const createReview = asyncHandler(async (req, res) => {
    const { businessId, unitId, stars, description = "" } = req.body || {};

    if (req.user.role !== "customer") {
        throw createError(403, "Only customers can create reviews");
    }

    if (!businessId || !unitId || stars === undefined) {
        throw createError(400, "Business ID, unit ID and stars are required");
    }

    if ( !mongoose.isObjectIdOrHexString(businessId) || !mongoose.isObjectIdOrHexString(unitId) ) {
        throw createError(400, "Invalid business or unit ID");
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        throw createError(400, "Stars must be a whole number from 1 to 5");
    }

    if (typeof description !== "string") {
        throw createError(400, "Description must be text");
    }

    const business = await Business.findById(businessId);

    if (!business) {
        throw createError(404, "Business not found");
    }

    const unit = await Unit.findById(unitId);

    if (!unit) {
        throw createError(404, "Unit not found");
    }

    if (unit.businessId.toString() !== business._id.toString()) {
        throw createError(400, "This unit does not belong to this business");
    }

    const customerId = req.user._id

    const existingReview = await Review.findOne({unitId, customerId})

    if(existingReview) {
        throw createError(400, 'you already have review')
    }

    let review;

    try {
        review = await Review.create({
            customerId: req.user._id,
            businessId: business._id,
            unitId: unit._id,
            stars,
            description: description.trim(),
        });
    } catch (error) {
        if (error.code === 11000) {
            throw createError(409, "You have already reviewed this business");
        }

        throw error;
    }

    return res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
    });
});

// @route  GET /api/customer/booking
// @access Private/customer
export const getAllBookings = asyncHandler(async (req, res) => {
    const allbookings = await Booking.find({customerId: req.user._id});

    if(allbookings.length === 0) {
        throw createError(400, 'No units founded')
    }

    res.status(200).json({
        success: true,
        message: 'all units retrived',
        data: allbookings
    })

});

// @route  GET /api/customer/booking/:id
// @access Private/customer
export const getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError(400, "Invalid Booking ID");
    }

    const booking = await Booking.findOne({_id: id, customerId: req.user._id})

    if (!booking) {
        throw createError(404, 'booking not found')
    }

    res.status(200).json({
        success: true,
        message: 'booking are retrived successfully',
        data: booking
    })
})

// @route  GET /api/customer/refund
// @access Private/customer
export const getAllRefunds = asyncHandler(async (req, res) => {
    const refunds = await Refund.find({customerId: req.user._id}).sort({ createdAt: -1 });

    if (refunds.length === 0) {
        throw createError(404, "No refunds found");
    }

    res.status(200).json({
        success: true,
        message: 'refunds are retrived successfully',
        data: refunds
    })
})

// @route  GET /api/customer/refund/:id
// @access Private/customer
export const getRefundById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError(400, "Invalid Refund ID");
    }

    const refund = await Refund.findOne({_id: id, customerId: req.user._id})

    if (!refund) {
        throw createError(404, 'refund not found')
    }

    res.status(200).json({
        success: true,
        message: 'refund are retrived successfully',
        data: refund
    })
})

// @route  GET /api/customer/refund/:id
// @access Private/customer
export const createRefund = asyncHandler(async (req, res) => {
    const customerId = req.user._id
    const {unitId, reason, bookingId} = req.body
    
    if(!unitId || !mongoose.Types.ObjectId.isValid(unitId) || !mongoose.Types.ObjectId.isValid(bookingId) || !bookingId|| !reason) {
        throw createError(400, "Please provide all required fields");
    }

    const refund = await Refund.create({
        customerId,
        unitId,
        bookingId,
        reason
    })

    res.status(200).json({
        success: true,
        message: 'refund requested successfully',
        data: refund
    })
})