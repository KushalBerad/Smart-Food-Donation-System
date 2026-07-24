import express from "express";
import { 
    createDonation, 
    getDonationById, 
    getMyDonations,
    getDonorHistory,
    getDonorHistoryById
} from "../controllers/donationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCreateDonation } from "../middleware/donationValidation.js";

const router = express.Router();

/**
 * @route   POST /api/v1/donations/create
 * @desc    Create a new food donation
 * @access  Private (Donor only)
 */
router.post("/create", protect, authorize("donor"), validateCreateDonation, createDonation);

/**
 * @route   GET /api/v1/donations/my-donations
 * @desc    Get all donations for the authenticated donor
 * @access  Private (Donor only)
 */
router.get("/my-donations", protect, authorize("donor"), getMyDonations);

/**
 * @route   GET /api/v1/donations/history
 * @desc    Get donor history list with filtering and pagination
 * @access  Private (Donor only)
 */
router.get("/history", protect, authorize("donor"), getDonorHistory);

/**
 * @route   GET /api/v1/donations/history/:id
 * @desc    Get single history item details
 * @access  Private (Donor only)
 */
router.get("/history/:id", protect, authorize("donor"), getDonorHistoryById);

/**
 * @route   GET /api/v1/donations/:id
 * @desc    Get a single donation by ID with populated donor details
 * @access  Private (Donor only)
 */
router.get("/:id", protect, authorize("donor"), getDonationById);

export default router;