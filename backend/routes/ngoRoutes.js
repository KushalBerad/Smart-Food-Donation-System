import express from "express";
import { getAvailableDonations, getNGOProfile, updateNGOProfile } from "../controllers/ngoController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/ngo/donations
 * @desc    Browse all available food donations across the platform (NGO view)
 * @access  Private (NGO only)
 */
router.get("/donations", protect, authorize("ngo"), getAvailableDonations);

/**
 * @route   GET /api/v1/ngo/profile
 * @desc    Fetch authenticated NGO's profile
 * @access  Private (NGO only)
 */
router.get("/profile", protect, authorize("ngo"), getNGOProfile);

/**
 * @route   PUT /api/v1/ngo/profile
 * @desc    Update authenticated NGO's profile
 * @access  Private (NGO only)
 */
router.put("/profile", protect, authorize("ngo"), updateNGOProfile);

export default router;
