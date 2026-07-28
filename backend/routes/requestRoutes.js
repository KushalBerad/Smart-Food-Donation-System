import express from "express";
import { getMyRequests } from "../controllers/ngoController.js";
import { getRequestDetails } from "../controllers/requestController.js";
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
 * @desc    Get detailed information of a specific donation request (NGO/Donor)
 * @access  Private (NGO or Donor — authorization check inside controller)
 */
router.get("/:id", protect, getRequestDetails);

export default router;
