import mongoose from "mongoose";
import DonationOffer from "../models/DonationOffer.js";
import NGORequirement from "../models/NGORequirement.js";
import Notification from "../models/Notification.js";

/**
 * @desc    Create a new food requirement (NGO posts a need)
 * @route   POST /api/v1/requirements
 * @access  Private (NGO only)
 */
export const createRequirement = async (req, res) => {
    try {
        const ngoId = req.user.id;

        const { foodName, category, requiredQuantity, description } = req.body;

        if (!foodName || !foodName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Food name is required.",
            });
        }

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required.",
            });
        }

        const reqQuantity = parseInt(requiredQuantity, 10);
        if (isNaN(reqQuantity) || reqQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Required quantity must be a positive number.",
            });
        }

        const requirement = await NGORequirement.create({
            ngoId,
            foodName: foodName.trim(),
            category,
            requiredQuantity: reqQuantity,
            fulfilledQuantity: 0,
            remainingQuantity: reqQuantity,
            description: description?.trim() || "",
            status: "open",
        });

        return res.status(201).json({
            success: true,
            message: "Requirement created successfully.",
            data: requirement,
        });
    } catch (error) {
        console.error("Error in createRequirement:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to create requirement.",
        });
    }
};

/**
 * @desc    Browse open requirements across the platform (donor view)
 * @route   GET /api/v1/requirements
 * @access  Private (Donor & NGO)
 */
export const getOpenRequirements = async (req, res) => {
    try {
        // Parse and validate pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        // Base filter: only open requirements with remaining quantity
        const filter = {
            status: "open",
            remainingQuantity: { $gt: 0 },
        };

        // Category filter
        const { category } = req.query;
        if (category && category !== "all") {
            filter.category = category;
        }

        // Search filter: match foodName
        const { search } = req.query;
        if (search && search.trim()) {
            filter.foodName = { $regex: search.trim(), $options: "i" };
        }

        const [totalCount, requirements] = await Promise.all([
            NGORequirement.countDocuments(filter),
            NGORequirement.find(filter)
                .populate({
                    path: "ngoId",
                    select: "organizationName name city phone",
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        const formattedRequirements = requirements.map((req) => ({
            _id: req._id,
            foodName: req.foodName,
            category: req.category,
            requiredQuantity: req.requiredQuantity,
            fulfilledQuantity: req.fulfilledQuantity,
            remainingQuantity: req.remainingQuantity,
            description: req.description,
            status: req.status,
            createdAt: req.createdAt,
            ngo: {
                _id: req.ngoId?._id || null,
                organizationName: req.ngoId?.organizationName || req.ngoId?.name || "Unknown",
                city: req.ngoId?.city || "Unknown",
                phone: req.ngoId?.phone || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            requirements: formattedRequirements,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error in getOpenRequirements:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve requirements.",
        });
    }
};

/**
 * @desc    Get all requirements posted by the authenticated NGO
 * @route   GET /api/v1/requirements/my
 * @access  Private (NGO only)
 */
export const getMyRequirements = async (req, res) => {
    try {
        const ngoId = req.user.id;

        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;
        const skip = (page - 1) * limit;

        const filter = { ngoId };

        // Optional status filter
        const { status } = req.query;
        if (status) {
            filter.status = status;
        }

        const [totalCount, requirements] = await Promise.all([
            NGORequirement.countDocuments(filter),
            NGORequirement.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            requirements,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error in getMyRequirements:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve requirements.",
        });
    }
};

/**
 * @desc    Get a single requirement with its offers
 * @route   GET /api/v1/requirements/:id
 * @access  Private (Donor & NGO)
 */
export const getRequirementDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement ID format",
            });
        }

        const requirement = await NGORequirement.findById(id)
            .populate({
                path: "ngoId",
                select: "name organizationName city phone email",
            })
            .lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found",
            });
        }

        // Fetch offers associated with this requirement
        const offers = await DonationOffer.find({ requirementId: id })
            .populate({
                path: "donorId",
                select: "name organizationName city phone",
            })
            .sort({ offeredAt: -1 })
            .lean();

        const isOwner = requirement.ngoId?._id?.toString() === userId || requirement.ngoId.toString() === userId;

        return res.status(200).json({
            success: true,
            data: {
                ...requirement,
                offers: offers.map((offer) => ({
                    _id: offer._id,
                    offeredQuantity: offer.offeredQuantity,
                    message: offer.message,
                    status: offer.status,
                    offeredAt: offer.offeredAt,
                    respondedAt: offer.respondedAt,
                    donor: {
                        _id: offer.donorId?._id || null,
                        organizationName: offer.donorId?.organizationName || offer.donorId?.name || "Unknown",
                        city: offer.donorId?.city || "Unknown",
                        phone: offer.donorId?.phone || "Unknown",
                    },
                })),
            },
        });
    } catch (error) {
        console.error("Error in getRequirementDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve requirement details.",
        });
    }
};

/**
 * @desc    Submit a donor offer to fulfill an NGO's requirement
 * @route   POST /api/v1/requirements/:id/offers
 * @access  Private (Donor only)
 */
export const createOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const donorId = req.user.id;
        const { offeredQuantity, message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement ID format",
            });
        }

        const quantity = parseInt(offeredQuantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Offered quantity must be a positive number.",
            });
        }

        const requirement = await NGORequirement.findById(id).lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found.",
            });
        }

        if (requirement.status !== "open") {
            return res.status(400).json({
                success: false,
                message: `Cannot offer to requirement with status '${requirement.status}'. It must be 'open'.`,
            });
        }

        if (quantity > requirement.remainingQuantity) {
            return res.status(400).json({
                success: false,
                message: `Cannot offer ${quantity} meal(s). Only ${requirement.remainingQuantity} meal(s) are still needed.`,
            });
        }

        // Prevent duplicate pending offers from the same donor
        const existingOffer = await DonationOffer.findOne({
            requirementId: id,
            donorId,
            status: "pending",
        }).lean();

        if (existingOffer) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending offer for this requirement.",
            });
        }

        const offer = await DonationOffer.create({
            requirementId: id,
            ngoId: requirement.ngoId,
            donorId,
            offeredQuantity: quantity,
            message: message?.trim() || "",
            status: "pending",
        });

        // Notify the NGO
        await Notification.create({
            userId: requirement.ngoId,
            type: "offer",
            title: "New Donation Offer",
            message: `A donor has offered ${quantity} meal(s) of "${requirement.foodName}" to your requirement.`,
        });

        return res.status(201).json({
            success: true,
            message: "Offer submitted successfully.",
            data: offer,
        });
    } catch (error) {
        console.error("Error in createOffer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to create offer.",
        });
    }
};

/**
 * @desc    Accept a donor offer for a requirement (supports partial fulfillment)
 * @route   PATCH /api/v1/requirements/:id/offers/:offerId/accept
 * @access  Private (NGO only)
 */
export const acceptOffer = async (req, res) => {
    try {
        const { id, offerId } = req.params;
        const ngoId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement or offer ID format",
            });
        }

        const requirement = await NGORequirement.findOne({ _id: id, ngoId }).lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found or access denied",
            });
        }

        if (requirement.status !== "open") {
            return res.status(400).json({
                success: false,
                message: `Cannot accept offers for requirement with status '${requirement.status}'. It must be 'open'.`,
            });
        }

        const offer = await DonationOffer.findOne({ _id: offerId, requirementId: id }).lean();

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found for this requirement",
            });
        }

        if (offer.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot accept offer with status '${offer.status}'. It must be 'pending'.`,
            });
        }

        if (offer.offeredQuantity > requirement.remainingQuantity) {
            return res.status(400).json({
                success: false,
                message: `Cannot accept ${offer.offeredQuantity} meal(s). Only ${requirement.remainingQuantity} meal(s) are still needed.`,
            });
        }

        // 1. Mark the offer as accepted (this is the confirmed fulfillment transaction record)
        await DonationOffer.findByIdAndUpdate(offerId, {
            status: "accepted",
            respondedAt: new Date(),
        });

        // 2. Update the requirement's fulfilled and remaining quantities
        const newFulfilled = (requirement.fulfilledQuantity || 0) + offer.offeredQuantity;
        const newRemaining = requirement.remainingQuantity - offer.offeredQuantity;

        if (newRemaining <= 0) {
            // Requirement fully satisfied - mark completed and reject all other pending offers
            await NGORequirement.findByIdAndUpdate(id, {
                status: "completed",
                fulfilledQuantity: requirement.requiredQuantity,
                remainingQuantity: 0,
            });

            await DonationOffer.updateMany(
                {
                    requirementId: id,
                    status: "pending",
                },
                {
                    status: "rejected",
                    respondedAt: new Date(),
                }
            );
        } else {
            // Requirement remains partially fulfilled / open for more offers
            await NGORequirement.findByIdAndUpdate(id, {
                fulfilledQuantity: newFulfilled,
                remainingQuantity: newRemaining,
                status: "open",
            });
        }

        // 3. Notify the donor
        await Notification.create({
            userId: offer.donorId,
            type: "accepted",
            title: "Offer Accepted",
            message: `Your offer of ${offer.offeredQuantity} meal(s) for "${requirement.foodName}" has been accepted by the NGO.`,
        });

        return res.status(200).json({
            success: true,
            message: "Offer accepted successfully.",
            data: {
                offerId,
                requirementId: id,
                acceptedQuantity: offer.offeredQuantity,
                fulfilledQuantity: newFulfilled,
                remainingQuantity: Math.max(newRemaining, 0),
                requirementStatus: newRemaining <= 0 ? "completed" : "open",
            },
        });
    } catch (error) {
        console.error("Error in acceptOffer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to accept offer.",
        });
    }
};

/**
 * @desc    Reject a donor offer for a requirement
 * @route   PATCH /api/v1/requirements/:id/offers/:offerId/reject
 * @access  Private (NGO only)
 */
export const rejectOffer = async (req, res) => {
    try {
        const { id, offerId } = req.params;
        const ngoId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement or offer ID format",
            });
        }

        const requirement = await NGORequirement.findOne({ _id: id, ngoId }).lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found or access denied",
            });
        }

        const offer = await DonationOffer.findOne({ _id: offerId, requirementId: id }).lean();

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found for this requirement",
            });
        }

        if (offer.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject offer with status '${offer.status}'. It must be 'pending'.`,
            });
        }

        // 1. Mark the offer as rejected
        await DonationOffer.findByIdAndUpdate(offerId, {
            status: "rejected",
            respondedAt: new Date(),
        });

        // 2. Notify the donor
        await Notification.create({
            userId: offer.donorId,
            type: "rejected",
            title: "Offer Rejected",
            message: `Your offer of ${offer.offeredQuantity} meal(s) for "${requirement.foodName}" has been rejected by the NGO.`,
        });

        return res.status(200).json({
            success: true,
            message: "Offer rejected successfully.",
            data: {
                offerId,
                requirementId: id,
            },
        });
    } catch (error) {
        console.error("Error in rejectOffer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to reject offer.",
        });
    }
};