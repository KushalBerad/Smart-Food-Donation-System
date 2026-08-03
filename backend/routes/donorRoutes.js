import express from "express";
import {
    getDonorProfile,
    updateDonorProfile,
} from "../controllers/donorController.js";
import {
    authorize,
    protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/donor/profile
 * @desc    Get authenticated donor profile
 * @access  Private (Donor only)
 */
router.get(
    "/profile",
    protect,
    authorize("donor"),
    getDonorProfile
);

/**
 * @route   PUT /api/v1/donor/profile
 * @desc    Update authenticated donor profile
 * @access  Private (Donor only)
 */
router.put(
    "/profile",
    protect,
    authorize("donor"),
    updateDonorProfile
);

export default router;