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

        const {
            foodName,
            category,
            requiredQuantity,
            description,
        } = req.body;

        // Validate food name
        if (!foodName || typeof foodName !== "string" || !foodName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Food name is required.",
            });
        }

        // Validate category
        const allowedCategories = [
            "veg",
            "non-veg",
            "bakery",
            "packaged",
            "other",
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message:
                    "Category must be one of: 'veg', 'non-veg', 'bakery', 'packaged', or 'other'.",
            });
        }

        // Validate required quantity
        const reqQuantity = Number(requiredQuantity);

        if (!Number.isInteger(reqQuantity) || reqQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Required quantity must be a positive whole number.",
            });
        }

        // Create the requirement with the full quantity initially remaining
        const requirement = await NGORequirement.create({
            ngoId,
            foodName: foodName.trim(),
            category,
            requiredQuantity: reqQuantity,
            fulfilledQuantity: 0,
            remainingQuantity: reqQuantity,
            description:
                typeof description === "string"
                    ? description.trim()
                    : "",
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
        // Parse and validate pagination
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);

        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }

        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }

        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        // Only requirements that can still receive offers
        const filter = {
            status: "open",
            remainingQuantity: { $gt: 0 },
        };

        // Optional category filter
        const { category } = req.query;

        if (category && category !== "all") {
            filter.category = category;
        }

        // Optional food-name search
        const { search } = req.query;

        if (typeof search === "string" && search.trim()) {
            filter.foodName = {
                $regex: search.trim(),
                $options: "i",
            };
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

        const formattedRequirements = requirements.map((requirement) => ({
            _id: requirement._id,
            foodName: requirement.foodName,
            category: requirement.category,
            requiredQuantity: requirement.requiredQuantity,
            fulfilledQuantity: requirement.fulfilledQuantity,
            remainingQuantity: requirement.remainingQuantity,
            description: requirement.description,
            status: requirement.status,
            createdAt: requirement.createdAt,
            ngo: {
                _id: requirement.ngoId?._id || null,
                organizationName:
                    requirement.ngoId?.organizationName ||
                    requirement.ngoId?.name ||
                    "Unknown",
                city: requirement.ngoId?.city || "Unknown",
                phone: requirement.ngoId?.phone || "Unknown",
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

        // Parse and validate pagination
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);

        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }

        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }

        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        // Restrict results to requirements owned by this NGO
        const filter = { ngoId };

        // Optional status filter
        const { status } = req.query;

        if (typeof status === "string" && status.trim()) {
            filter.status = status.trim();
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

        // Validate requirement ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement ID format",
            });
        }

        // Fetch requirement and NGO details
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

        // Fetch all offers associated with this requirement
        const offers = await DonationOffer.find({
            requirementId: id,
        })
            .populate({
                path: "donorId",
                select: "name organizationName city phone",
            })
            .sort({ offeredAt: -1 })
            .lean();

        const formattedOffers = offers.map((offer) => ({
            _id: offer._id,
            offeredQuantity: offer.offeredQuantity,
            message: offer.message,
            status: offer.status,
            offeredAt: offer.offeredAt,
            respondedAt: offer.respondedAt,
            donor: {
                _id: offer.donorId?._id || null,
                organizationName:
                    offer.donorId?.organizationName ||
                    offer.donorId?.name ||
                    "Unknown",
                city: offer.donorId?.city || "Unknown",
                phone: offer.donorId?.phone || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            data: {
                ...requirement,
                offers: formattedOffers,
            },
        });
    } catch (error) {
        console.error("Error in getRequirementDetails:", error);

        return res.status(500).json({
            success: false,
            message:
                "Internal server error. Failed to retrieve requirement details.",
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

        // Validate requirement ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement ID format",
            });
        }

        // Validate offered quantity
        const quantity = Number(offeredQuantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Offered quantity must be a positive whole number.",
            });
        }

        // Fetch the requirement
        const requirement = await NGORequirement.findById(id).lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found.",
            });
        }

        // Requirement must still be open and have quantity remaining
        if (
            requirement.status !== "open" ||
            requirement.remainingQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This requirement is no longer accepting donation offers.",
            });
        }

        // Do not allow an offer larger than the remaining requirement
        if (quantity > requirement.remainingQuantity) {
            return res.status(400).json({
                success: false,
                message: `Cannot offer ${quantity} meal(s). Only ${requirement.remainingQuantity} meal(s) are still needed.`,
            });
        }

        // Prevent multiple pending offers from the same donor
        const existingOffer = await DonationOffer.findOne({
            requirementId: id,
            donorId,
            status: "pending",
        }).lean();

        if (existingOffer) {
            return res.status(400).json({
                success: false,
                message:
                    "You already have a pending offer for this requirement.",
            });
        }

        // Create the pending offer
        const offer = await DonationOffer.create({
            requirementId: id,
            ngoId: requirement.ngoId,
            donorId,
            offeredQuantity: quantity,
            message:
                typeof message === "string"
                    ? message.trim()
                    : "",
            status: "pending",
        });

        // Notify the NGO about the new offer
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
    const session = await mongoose.startSession();

    try {
        const { id, offerId } = req.params;
        const ngoId = req.user.id;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(offerId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement or offer ID format",
            });
        }

        let result;

        await session.withTransaction(async () => {
            // 1. Verify that the requirement belongs to the authenticated NGO
            const requirement = await NGORequirement.findOne({
                _id: id,
                ngoId,
                status: "open",
            })
                .session(session)
                .lean();

            if (!requirement) {
                const existingRequirement = await NGORequirement.findOne({
                    _id: id,
                    ngoId,
                })
                    .session(session)
                    .select("status")
                    .lean();

                if (!existingRequirement) {
                    const error = new Error(
                        "Requirement not found or access denied"
                    );
                    error.statusCode = 404;
                    throw error;
                }

                const error = new Error(
                    `Cannot accept offers for requirement with status '${existingRequirement.status}'. It must be 'open'.`
                );
                error.statusCode = 400;
                throw error;
            }

            // 2. Find the pending offer for this requirement
            const offer = await DonationOffer.findOne({
                _id: offerId,
                requirementId: id,
            })
                .session(session)
                .lean();

            if (!offer) {
                const error = new Error(
                    "Offer not found for this requirement"
                );
                error.statusCode = 404;
                throw error;
            }

            if (offer.status !== "pending") {
                const error = new Error(
                    `Cannot accept offer with status '${offer.status}'. It must be 'pending'.`
                );
                error.statusCode = 400;
                throw error;
            }

            // 3. Validate the offered quantity
            if (
                !Number.isInteger(offer.offeredQuantity) ||
                offer.offeredQuantity <= 0
            ) {
                const error = new Error(
                    "Offer contains an invalid quantity."
                );
                error.statusCode = 400;
                throw error;
            }

            if (offer.offeredQuantity > requirement.remainingQuantity) {
                const error = new Error(
                    `Cannot accept ${offer.offeredQuantity} meal(s). Only ${requirement.remainingQuantity} meal(s) are still needed.`
                );
                error.statusCode = 400;
                throw error;
            }

            // 4. Atomically accept the offer only if it is still pending
            const updatedOffer = await DonationOffer.findOneAndUpdate(
                {
                    _id: offerId,
                    requirementId: id,
                    status: "pending",
                },
                {
                    $set: {
                        status: "accepted",
                        respondedAt: new Date(),
                    },
                },
                {
                    new: true,
                    session,
                }
            ).lean();

            if (!updatedOffer) {
                const error = new Error(
                    "This offer is no longer pending and cannot be accepted."
                );
                error.statusCode = 409;
                throw error;
            }

            // 5. Atomically allocate the offered quantity from the requirement
            const updatedRequirement =
                await NGORequirement.findOneAndUpdate(
                    {
                        _id: id,
                        ngoId,
                        status: "open",
                        remainingQuantity: {
                            $gte: updatedOffer.offeredQuantity,
                        },
                    },
                    {
                        $inc: {
                            fulfilledQuantity: updatedOffer.offeredQuantity,
                            remainingQuantity: -updatedOffer.offeredQuantity,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                ).lean();

            if (!updatedRequirement) {
                const error = new Error(
                    "The requirement no longer has enough quantity available."
                );
                error.statusCode = 409;
                throw error;
            }

            // 6. Automatically complete the requirement when fully fulfilled
            let finalRequirement = updatedRequirement;

            if (updatedRequirement.remainingQuantity === 0) {
                finalRequirement = await NGORequirement.findOneAndUpdate(
                    {
                        _id: id,
                        ngoId,
                        status: "open",
                        remainingQuantity: 0,
                    },
                    {
                        $set: {
                            status: "completed",
                            fulfilledQuantity: updatedRequirement.requiredQuantity,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                ).lean();

                if (!finalRequirement) {
                    const error = new Error(
                        "Failed to complete the requirement."
                    );
                    error.statusCode = 500;
                    throw error;
                }

                // 7. Automatically reject every other pending offer
                await DonationOffer.updateMany(
                    {
                        requirementId: id,
                        status: "pending",
                    },
                    {
                        $set: {
                            status: "rejected",
                            respondedAt: new Date(),
                        },
                    },
                    {
                        session,
                    }
                );
            }

            // 8. Notify the donor inside the same transaction
            await Notification.create(
                [
                    {
                        userId: updatedOffer.donorId,
                        type: "accepted",
                        title: "Offer Accepted",
                        message: `Your offer of ${updatedOffer.offeredQuantity} meal(s) for "${requirement.foodName}" has been accepted by the NGO.`,
                    },
                ],
                { session }
            );

            result = {
                offerId: updatedOffer._id,
                requirementId: finalRequirement._id,
                acceptedQuantity: updatedOffer.offeredQuantity,
                fulfilledQuantity: finalRequirement.fulfilledQuantity,
                remainingQuantity: finalRequirement.remainingQuantity,
                requirementStatus: finalRequirement.status,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Offer accepted successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Error in acceptOffer:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to accept offer.",
        });
    } finally {
        await session.endSession();
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

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(offerId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid requirement or offer ID format",
            });
        }

        // Verify that the requirement belongs to the authenticated NGO
        const requirement = await NGORequirement.findOne({
            _id: id,
            ngoId,
        })
            .select("foodName")
            .lean();

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found or access denied",
            });
        }

        // Atomically reject only a pending offer belonging to this requirement
        const updatedOffer = await DonationOffer.findOneAndUpdate(
            {
                _id: offerId,
                requirementId: id,
                ngoId,
                status: "pending",
            },
            {
                $set: {
                    status: "rejected",
                    respondedAt: new Date(),
                },
            },
            {
                new: true,
            }
        ).lean();

        if (!updatedOffer) {
            const existingOffer = await DonationOffer.findOne({
                _id: offerId,
                requirementId: id,
                ngoId,
            })
                .select("status")
                .lean();

            if (!existingOffer) {
                return res.status(404).json({
                    success: false,
                    message: "Offer not found for this requirement",
                });
            }

            return res.status(400).json({
                success: false,
                message: `Cannot reject offer with status '${existingOffer.status}'. It must be 'pending'.`,
            });
        }

        // Notify the donor
        await Notification.create({
            userId: updatedOffer.donorId,
            type: "rejected",
            title: "Offer Rejected",
            message: `Your offer of ${updatedOffer.offeredQuantity} meal(s) for "${requirement.foodName}" has been rejected by the NGO.`,
        });

        return res.status(200).json({
            success: true,
            message: "Offer rejected successfully.",
            data: {
                offerId: updatedOffer._id,
                requirementId: updatedOffer.requirementId,
                status: updatedOffer.status,
                respondedAt: updatedOffer.respondedAt,
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