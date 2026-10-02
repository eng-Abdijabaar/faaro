import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import crypto from "crypto";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        unique: true
    },
    profile: {
        url: { type: String},
        publicId: {type: String}
    },
    role: {
        type: String,
        enum: ["customer", "owner", "admin"],
        default: 'customer'
    },
    status: {
        type: String,
        enum:["active", "suspended"],
        default: "active"
    },
    password: {
        type: String,
        minLength: [6, 'password must be at least 5 characters'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
}, {timestamps: true});

// Hash the password before saving the user
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate an Email Verification Token
userSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash it and save it to the model (for security if DB is compromised)
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    return verificationToken;
};

// Generate a Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema)

export default User;