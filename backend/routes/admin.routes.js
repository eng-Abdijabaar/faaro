import { Router } from "express";
import { suspendUser, createBusiness, getAllUsers, getUserById, getAllBusiness, getAllRefunds, getRefundById, updateRefundStatus, getAllBookings, getBookingById, } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/authmiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/owners", getAllBusiness);
router.get("/users/:id", getUserById);
router.post("/users/suspend/:id", suspendUser);
router.post( "/users/businessOwner/:id", upload.array("images", 5), createBusiness );

router.get("/refund", getAllRefunds);
router.get("/refund/:id", getRefundById);
router.patch("/refund/:id", updateRefundStatus);

router.get("/booking", getAllBookings);
router.get("/booking/:id", getBookingById);

export default router;