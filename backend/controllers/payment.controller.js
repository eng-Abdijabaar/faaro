import mongoose from "mongoose";
import { getStripe } from "../config/stripe.js";
import Booking from "../models/Booking.js";
import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";

const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// @route  POST /api/customer/payment
// @access Private/customer
export const createCheckoutSession = asyncHandler(async (req, res) => {
    if (req.user?.role !== "customer") {
        throw createError(403, "Only customers can make payments");
    }

    const { id } = req.body ?? {};

    if (!mongoose.isObjectIdOrHexString(id)) {
        throw createError(400, "Invalid booking ID");
    }

    const booking = await Booking.findOne({
        _id: id,
        customerId: req.user._id,
    });

    if (!booking) {
        throw createError(404, "Booking not found");
    }

    if (booking.isValid || booking.paymentStatus === "paid") {
        throw createError(409, "This booking has already been paid");
    }

    // Uses your existing booking.price field.
    const amountInCents = Math.round(Number(booking.price) * 100);

    if (!Number.isSafeInteger(amountInCents) || amountInCents < 1) {
        throw createError(400, "Booking has an invalid payment amount");
    }

    const clientUrl = process.env.Client_URI?.replace(/\/+$/, "");

    if (!clientUrl) {
        throw new Error("CLIENT_URL is not configured");
    }

    const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.code,
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${clientUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/purchase/cancel`,
        metadata: {
            bookingId: booking._id.toString(),
            customerId: req.user._id.toString(),
        },
    });

    booking.stripeSessionId = session.id;
    booking.paymentStatus = "unpaid";
    await booking.save();

    res.status(201).json({
        success: true,
        data: {
            sessionId: session.id,
            checkoutUrl: session.url,
            totalAmount: amountInCents / 100,
        },
    });
});

// @route  POST /api/customer/payment/success
// @access Private/customer
export const checkoutSuccess = asyncHandler(async (req, res) => {
    if (req.user?.role !== "customer") {
        throw createError(403, "Only customers can verify payments");
    }

    const { sessionId } = req.body ?? {};

    if (typeof sessionId !== "string" || !sessionId.trim()) {
        throw createError(400, "Stripe session ID is required");
    }


    const session = await getStripe().checkout.sessions.retrieve(
        sessionId.trim()
    );


    if (
        session.mode !== "payment" ||
        session.status !== "complete" ||
        session.payment_status !== "paid"
    ) {
        throw createError(400, "Payment is not complete");
    }

    const { bookingId, customerId } = session.metadata ?? {};

    if (!bookingId || customerId !== req.user._id.toString()) {
        throw createError(403, "This payment does not belong to you");
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        customerId: req.user._id,
    });

    if (!booking) {
        throw createError(404, "Booking not found");
    }

    const expectedAmount = Math.round(Number(booking.price) * 100);

    if (
        session.currency !== "usd" ||
        session.amount_total !== expectedAmount
    ) {
        throw createError(400, "Payment amount does not match the booking");
    }

    const unit = await Unit.findById(booking.unitId);

    if (!unit) {
        throw createError(404, "Unit not found");
    }

    unit.isAvailable = false;
    await unit.save();

    booking.isValid = true;
    booking.paymentStatus = "paid";
    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(200).json({
        success: true,
        message: "Payment successful. Booking confirmed.",
        data: {
            bookingId: booking._id,
            paymentStatus: booking.paymentStatus,
            isValid: booking.isValid,
        },
    });
});