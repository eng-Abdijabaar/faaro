import mongoose from "mongoose";
import { type } from "os";

const bookingSchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    document: {
        url: {
            type: String,
        },
        publicId: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ['cancelled', 'progress', 'expired'],
        default: 'progress'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isValid: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid']
    },
    stripeSessionId: {
        type: String
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
