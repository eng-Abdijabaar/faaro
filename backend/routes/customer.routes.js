// import { Router } from "express";
// import { getAllUnits, getAllBusinesses, getUnitById, getBusinessById, createBooking, createReview, getAllRefunds, getRefundById, createRefund, } from "../controllers/customer.controller.js";
// import { protect } from "../middleware/authmiddleware.js";
// import upload from "../middleware/multer.js";

// const router = Router();

// router.use(protect);

// router.get("/units", getAllUnits);
// router.get("/units/:id", getUnitById);
// router.get("/businesses", getAllBusinesses);
// router.get("/business/:id", getBusinessById);

// router.post("/booking", upload.single("document"), createBooking);
// router.post("/reviews", createReview);

// router.get("/refund", getAllRefunds);
// router.get("/refund/:id", getRefundById);
// router.post("/refund", createRefund);

// export default router;

import { Router } from "express";

import {
  getAllUnits,
  getAllBusinesses,
  getUnitById,
  getBusinessById,
  createBooking,
  createReview,
  getAllRefunds,
  getRefundById,
  createRefund,
  getAllBookings,
  getBookingById,
} from "../controllers/customer.controller.js";

import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

/* ==============================
   PUBLIC CATALOG
============================== */

router.get("/units", getAllUnits);

router.get(
  "/units/:id",
  getUnitById
);

router.get(
  "/businesses",
  getAllBusinesses
);

router.get(
  "/business/:id",
  getBusinessById
);

/* ==============================
   CUSTOMER ACTIONS
============================== */

router.post(
  "/booking",
  protect,
  upload.single("document"),
  createBooking
);

router.get(
  "/bookings",
  protect,
  getAllBookings
);
router.get(
  "/bookings/:id",
  protect,
  getBookingById
);

router.post(
  "/reviews",
  protect,
  createReview
);

/* ==============================
   REFUNDS
============================== */

router.get(
  "/refund",
  protect,
  getAllRefunds
);

router.get(
  "/refund/:id",
  protect,
  getRefundById
);

router.post(
  "/refund",
  protect,
  createRefund
);

export default router;