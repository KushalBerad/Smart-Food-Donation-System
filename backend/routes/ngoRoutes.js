import express from "express";
import { getAvailableDonations } from "../controllers/ngoController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/ngo/donations
 * @desc    Browse all available food donations across the platform (NGO view)
 * @access  Private (NGO only)
 */
router.get("/donations", protect, authorize("ngo"), getAvailableDonations);

export default router;