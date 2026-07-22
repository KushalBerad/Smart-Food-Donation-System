import express from "express";
import { createDonation } from "../controllers/donationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCreateDonation } from "../middleware/donationValidation.js";

const router = express.Router();

/**
 * @route   POST /api/donations
 * @desc    Create a new food donation
 * @access  Private (Donor only)
 */
router.post("/create", protect, authorize("donor"), validateCreateDonation, createDonation );

export default router;