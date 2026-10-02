import { Router } from "express";
import { createUnit, updateUnit, deleteUnit, getAllBookings, getBookingById, CheckBooking, getMyBusiness, getMyUnits, } from "../controllers/business.controller.js";
import { protect, ownerOnly } from "../middleware/authmiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.use(protect, ownerOnly);

router.post("/units", upload.array("images", 5), createUnit);
router.patch("/units/:id", upload.array("images", 5), updateUnit);
router.delete("/units/:id", deleteUnit);

router.get( "/profile", getMyBusiness );
router.get( "/units", getMyUnits );

router.get("/booking", getAllBookings);
router.get("/booking/:id", getBookingById);
router.post("/check-booking", CheckBooking);

export default router;