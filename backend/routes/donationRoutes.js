import express from "express";
import {
    completeDonation,
    createDonation,
    deleteDonation,
    getDonationById,
    getDonationStatus,
    getDonorHistory,
    getDonorHistoryById,
    getMyDonations,
    updateDonation,
    updateDonationStatus,
} from "../controllers/donationController.js";
import {
    acceptRequest,
    getDonationRequests,
    getPendingRequests,
    getRequestDetails,
    rejectRequest
} from "../controllers/requestController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
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
 * @route   GET /api/v1/donations/requests
 * @desc    Fetch pending donation requests for the authenticated donor
 * @access  Private (Donor only)
 */
router.get("/requests", protect, authorize("donor"), getPendingRequests);

router.get("/requests/:id", protect, authorize("donor"), getRequestDetails);

router.get("/:id/requests", protect, authorize("donor"), getDonationRequests);

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

/**
 * @route   GET /api/v1/donations/:id
 * @desc    Get a single donation by ID with populated donor details
 * @access  Private (Donor only)
 */
router.get("/:id", protect, authorize("donor", "ngo"), getDonationById);

/**
 * @route   GET /api/v1/donations/:id/status
 * @desc    Get current donation status
 * @access  Private (Donor & NGO)
 */
router.get("/:id/status", protect, authorize("donor", "ngo"), getDonationStatus);

/**
 * @route   PATCH /api/v1/donations/:id/complete
 * @desc    Complete a donation workflow (Donor marks donation as finished)
 * @access  Private (Donor only)
 */
router.patch("/:id/complete", protect, authorize("donor"), completeDonation);

/**
 * @route   PATCH /api/v1/donations/:id/status
 * @desc    Update donation status
 * @access  Private (Donor)
 */
router.patch("/:id/status", protect, authorize("donor"), updateDonationStatus);

router.put("/:id", protect, authorize("donor"), updateDonation);

router.delete("/:id", protect, authorize("donor"), deleteDonation);

export default router;
