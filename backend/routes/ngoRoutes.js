import express from "express";
import {
    createDonationRequest,
    getAvailableDonations,
    getMyRequests,
    getNGODashboardStats,
    getNGOHistory,
    getNGOProfile,
    updateNGOProfile,
} from "../controllers/ngoController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/ngo/dashboard
 * @desc    Get NGO dashboard statistics + recent data
 * @access  Private (NGO only)
 */
router.get("/dashboard", protect, authorize("ngo"), getNGODashboardStats);

/**
 * @route   GET /api/v1/ngo/donations
 * @desc    Browse all available food donations across the platform (NGO view)
 * @access  Private (NGO only)
 */
router.get("/donations", protect, authorize("ngo"), getAvailableDonations);

/**
 * @route   POST /api/v1/ngo/request
 * @desc    Create a donation request (NGO requests a food donation)
 * @access  Private (NGO only)
 */
router.post("/request", protect, authorize("ngo"), createDonationRequest);

router.get(
    "/requests",
    protect,
    authorize("ngo"),
    getMyRequests
);

/**
 * @route   GET /api/v1/ngo/history
 * @desc    Get NGO history (completed/cancelled pickups)
 * @access  Private (NGO only)
 */
router.get("/history", protect, authorize("ngo"), getNGOHistory);

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
