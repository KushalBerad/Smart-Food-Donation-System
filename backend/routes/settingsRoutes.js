import express from "express";
import { getUserSettings, updateUserSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/settings
 * @desc    Fetch user settings & preferences
 * @access  Private (Donor & NGO)
 */
router.get("/", protect, getUserSettings);

/**
 * @route   PUT /api/v1/settings
 * @desc    Update user settings & preferences
 * @access  Private (Donor & NGO)
 */
router.put("/", protect, updateUserSettings);

export default router;