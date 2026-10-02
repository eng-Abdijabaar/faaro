import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import sendMail from "../lib/sendmail.js";
import generateToken from "../lib/generateToken.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { sendSMS } from "../lib/smsServices.js";


const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 24;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizePhone = (phone) => phone.trim();

const getClientUrl = () => {
  // CLIENT_URL is preferred. Client_URI supports your existing environment variable.
  const value = process.env.Client_URI;

  if (!value) {
    throw new Error("CLIENT_URL is not configured");
  }

  return value.replace(/\/+$/, "");
};

const makeEmail = ({ title, fullName, message, actionLabel, actionUrl }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; color: #17212b;">
    <h1>${title}</h1>
    <p>Hello ${fullName},</p>
    <p>${message}</p>
    <p style="margin: 28px 0;">
      <a href="${actionUrl}"
         style="background: #087f5b; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
        ${actionLabel}
      </a>
    </p>
    <p>If you did not request this, you can ignore this email.</p>
    <p>Faaro Team</p>
  </div>
`;

const publicUserData = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @route POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body ?? {};

  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof password !== "string" ||
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    res.status(400);
    throw new Error(
      `Provide your full name, email, phone, and a password between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`
    );
  }

  const clientUrl = getClientUrl();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
  });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email or phone already exists");
  }

  let user;

  try {
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      // Never accept a role from the public registration request.
      role: "customer",
      isVerified: false,
    });
  } catch (error) {
    // The database unique indexes also protect against simultaneous requests.
    if (error?.code === 11000) {
      res.status(409);
      throw new Error("An account with this email or phone already exists");
    }

    throw error;
  }

  const verificationToken = user.getVerificationToken();
  await user.save();

  const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;

  await sendMail({
    to: user.email,
    subject: "Verify your Faaro account",
    message: makeEmail({
      title: "Welcome to Faaro",
      fullName: user.fullName,
      message: `Please verify your email address to activate your account. ${verificationToken}`,
      actionLabel: "Verify email",
      actionUrl: verificationUrl,
    }),
  });

  // await sendSMS(user.phone, 'welcome mr');

  res.status(201).json({
    success: true,
    message: "Account created. Check your email to verify it.",
    data: publicUserData(user),
  });
});

// @route POST /api/auth/verify-email
// @access Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body ?? {};

  if (typeof token !== "string" || !token) {
    res.status(400);
    throw new Error("Verification token is required");
  }

  const user = await User.findOne({
    verificationToken: hashToken(token),
    verificationTokenExpire: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// @route POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body ?? {};

  const hasEmail = typeof email === "string" && email.trim().length > 0;
  const hasPhone = typeof phone === "string" && phone.trim().length > 0;

  if (
    typeof password !== "string" ||
    !password ||
    hasEmail === hasPhone
  ) {
    res.status(400);
    throw new Error("Provide a password and either email or phone");
  }

  const query = hasEmail
    ? { email: normalizeEmail(email) }
    : { phone: normalizePhone(phone) };

  // "+password" is needed if you add select: false to the password schema field.
  const user = await User.findOne(query)

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email/phone or password");
  }

  if (user.status !== "active") {
    res.status(403);
    throw new Error("This account is suspended");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  const accessToken = generateToken(res, user._id);

  res.status(200).json({
    success: true,
    data: publicUserData(user),
    accessToken,
  });
});

// @route POST /api/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.body ?? {};

  const hasEmail = typeof email === "string" && email.trim().length > 0;
  const hasPhone = typeof phone === "string" && phone.trim().length > 0;

  if (hasEmail === hasPhone) {
    res.status(400);
    throw new Error("Provide either an email address or phone number");
  }

  const query = hasEmail
    ? { email: normalizeEmail(email) }
    : { phone: normalizePhone(phone) };

  const user = await User.findOne(query);

  // Same response whether the account exists or not.
  const message = "If an account matches, password reset instructions will be sent.";

  if (user?.isVerified && user.email) {
    const clientUrl = getClientUrl();
    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    await sendMail({
      to: user.email,
      subject: "Reset your Faaro password",
      message: makeEmail({
        title: "Password reset",
        fullName: user.fullName,
        message: "Use the link below to choose a new password.",
        actionLabel: "Reset password",
        actionUrl: resetUrl,
      }),
    });
  }

  res.status(200).json({ success: true, message });
});

// @route POST /api/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body ?? {};

  if (typeof token !== "string" || !token) {
    res.status(400);
    throw new Error("Reset token is required");
  }

  if (
    typeof password !== "string" ||
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    res.status(400);
    throw new Error(
      `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`
    );
  }

  const user = await User.findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordTokenExpire: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// @route POST /api/auth/refresh
// @access Public; reads the HTTP-only refresh cookie
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not configured");
  }

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      { algorithms: ["HS256"] }
    );
  } catch {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user || !user.isVerified || user.status !== "active") {
    res.status(401);
    throw new Error("User is unavailable");
  }

  // This creates a new access token and sets a new refresh-token cookie.
  const accessToken = generateToken(res, user._id);

  res.status(200).json({
    success: true,
    data: publicUserData(user),
    accessToken,
  });
});

// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});