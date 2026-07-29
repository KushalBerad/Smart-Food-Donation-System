import express from "express";
import { getMyRequests } from "../controllers/ngoController.js";
import { getRequestDetails, confirmPickup } from "../controllers/requestController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/requests/my
 * @desc    Fetch all donation requests made by the authenticated NGO
 * @access  Private (NGO only)
 */
router.get("/my", protect, authorize("ngo"), getMyRequests);

/**
 * @route   GET /api/v1/requests/:id
 * @desc    Get detailed information of a specific donation request
 * @access  Private (Donor or NGO — internal auth check)
 */
router.get("/:id", protect, getRequestDetails);

/**
 * @route   PATCH /api/v1/requests/:id/pickup
 * @desc    Confirm pickup of a donation by NGO
 * @access  Private (NGO only)
 */
router.patch("/:id/pickup", protect, authorize("ngo"), confirmPickup);

export default router;
