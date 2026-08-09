import express from "express";
import {
    acceptOffer,
    createOffer,
    createRequirement,
    getMyRequirements,
    getOpenRequirements,
    getRequirementDetails,
    rejectOffer,
} from "../controllers/requirementController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/requirements
 * @desc    Create a new food requirement (NGO posts a need)
 * @access  Private (NGO only)
 */
router.post("/", protect, authorize("ngo"), createRequirement);

/**
 * @route   GET /api/v1/requirements
 * @desc    Browse open requirements across the platform (donor view)
 * @access  Private (Donor & NGO)
 */
router.get("/", protect, authorize("donor", "ngo"), getOpenRequirements);

/**
 * @route   GET /api/v1/requirements/my
 * @desc    Get all requirements posted by the authenticated NGO
 * @access  Private (NGO only)
 */
router.get("/my", protect, authorize("ngo"), getMyRequirements);

/**
 * @route   GET /api/v1/requirements/:id
 * @desc    Get a single requirement with its offers
 * @access  Private (Donor & NGO)
 */
router.get("/:id", protect, authorize("donor", "ngo"), getRequirementDetails);

/**
 * @route   POST /api/v1/requirements/:id/offers
 * @desc    Submit a donor offer to fulfill an NGO's requirement
 * @access  Private (Donor only)
 */
router.post("/:id/offers", protect, authorize("donor"), createOffer);

/**
 * @route   PATCH /api/v1/requirements/:id/offers/:offerId/accept
 * @desc    Accept a donor offer for a requirement (supports partial fulfillment)
 * @access  Private (NGO only)
 */
router.patch("/:id/offers/:offerId/accept", protect, authorize("ngo"), acceptOffer);

/**
 * @route   PATCH /api/v1/requirements/:id/offers/:offerId/reject
 * @desc    Reject a donor offer for a requirement
 * @access  Private (NGO only)
 */
router.patch("/:id/offers/:offerId/reject", protect, authorize("ngo"), rejectOffer);

export default router;