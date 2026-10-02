import { Router } from "express";
import { createCheckoutSession, checkoutSuccess, } from "../controllers/payment.controller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = Router();

router.post("/", protect, createCheckoutSession);
router.post("/success", protect, checkoutSuccess);

export default router;