import express from "express";
import { 
    createDonation, 
    getDonationById, 
    getMyDonations,
    getDonorHistory,
    getDonorHistoryById
} from "../controllers/donationController.js";
import { 
    getPendingRequests, 
    getRequestDetails, 
    acceptRequest, 
    rejectRequest 
} from "../controllers/requestController.js";
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

/**
 * @route   GET /api/v1/donations/requests
 * @desc    Fetch pending donation requests for the authenticated donor
 * @access  Private (Donor only)
 */
router.get("/requests", protect, authorize("donor"), getPendingRequests);

/**
 * @route   GET /api/v1/donations/requests/:id
 * @desc    Get detailed information of a specific donation request
 * @access  Private (Donor or NGO)
 */
router.get("/requests/:id", protect, getRequestDetails);

/**
 * @route   PATCH /api/v1/donations/requests/:id/accept
 * @desc    Accept an NGO donation request
 * @access  Private (Donor only)
 */
router.patch("/requests/:id/accept", protect, authorize("donor"), acceptRequest);

/**
 * @route   PATCH /api/v1/donations/requests/:id/reject
 * @desc    Reject an NGO donation request
 * @access  Private (Donor only)
 */
router.patch("/requests/:id/reject", protect, authorize("donor"), rejectRequest);

export default router;
