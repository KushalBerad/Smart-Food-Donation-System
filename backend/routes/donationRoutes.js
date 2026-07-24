import express from "express";
import { createDonation, getDonationById, getMyDonations, getDonorDashboard } from "../controllers/donationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCreateDonation } from "../middleware/donationValidation.js";

const router = express.Router();

/**
 * @route   POST /api/donations/create
 * @desc    Create a new food donation
 * @access  Private (Donor only)
 */
router.post("/create", protect, authorize("donor"), validateCreateDonation, createDonation);

/**
 * @route   GET /api/donations/dashboard
 * @desc    Get donor dashboard data including summary, active donations, and recent requests
 * @access  Private (Donor only)
 */

router.get("/dashboard", protect,authorize("donor"),getDonorDashboard);

/**
 * @route   GET /api/donations/my-donations
 * @desc    Get all donations for the authenticated donor
 * @access  Private (Donor only)
 */
router.get("/my-donations", protect, authorize("donor"), getMyDonations);

/**
 * @route   GET /api/donations/:id
 * @desc    Get a single donation by ID with populated donor details
 * @access  Private (Donor only)
 */
router.get("/:id", protect, authorize("donor"), getDonationById);

export default router;
