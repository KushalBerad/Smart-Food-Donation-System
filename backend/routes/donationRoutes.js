import express from "express";
import { createDonation, getMyDonations } from "../controllers/donationController.js";
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
 * @route   GET /api/donations/my-donations
 * @desc    Get all donations for the authenticated donor
 * @access  Private (Donor only)
 */
router.get("/my-donations", protect, authorize("donor"), getMyDonations);

export default router;
