import express from "express";
import { getMyRequests } from "../controllers/ngoController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/requests/my
 * @desc    Fetch all donation requests made by the authenticated NGO
 * @access  Private (NGO only)
 */
router.get("/my", protect, authorize("ngo"), getMyRequests);

export default router;