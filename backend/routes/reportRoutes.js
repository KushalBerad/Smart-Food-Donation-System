import express from "express";
import { getImpactStatistics } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/reports
 * @desc    Get impact statistics for the authenticated user (Donor or NGO)
 * @access  Private (Donor & NGO)
 */
router.get("/", protect, getImpactStatistics);

export default router;