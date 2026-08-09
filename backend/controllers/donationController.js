import mongoose from "mongoose";
import DonationHistory from "../models/DonationHistory.js";
import DonationRequest from "../models/DonationRequest.js";
import FoodDonation from "../models/FoodDonation.js";
import User from "../models/User.js";

/**
 * @desc    Create a new food donation
 * @route   POST /api/v1/donations/create
 * @access  Private (Donor only)
 */
export const createDonation = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;

        // Safety Check: Verify that the donorId actually exists in the database
        const donorExists = await User.findById(donorId);
        if (!donorExists) {
            return res.status(404).json({
                success: false,
                message: "Donor not found in the database",
            });
        }

        const {
            foodName,
            category,
            quantity,
            preparedAt,
            expiryAt,
            pickupAddress,
            pickupTime,
            description,
        } = req.body;

        const parsedQuantity = parseInt(quantity, 10) || 0;

        const donation = await FoodDonation.create({
            donorId,
            foodName,
            category,
            quantity,
            remainingQuantity: parsedQuantity,
            preparedAt,
            expiryAt,
            pickupAddress,
            pickupTime,
            description,
            status: "available",
        });

        return res.status(201).json({
            success: true,
            message: "Donation created successfully",
            data: donation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to create donation.",
        });
    }
};

/**
 * @desc    Get a single donation by ID with populated donor details
 * @route   GET /api/v1/donations/:id
 * @access  Private (Donor only)
 */
export const getDonationById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const { id } = req.params;

        // Safety Check: Validate ObjectId format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation ID format",
            });
        }

        // Query and populate donor details from Users collection
        const donation = await FoodDonation.findById(id)
            .populate({
                path: "donorId",
                select: "name phone organizationName city email",
            })
            .lean();

        // Safety Check: If no record found, return 404
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: donation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve donation.",
        });
    }
};

/**
 * @desc    Get all donations for the authenticated donor
 * @route   GET /api/v1/donations/my-donations
 * @access  Private (Donor only)
 */
export const getMyDonations = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;

        // Safety Check: Validate that donorId is a valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(donorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }

        // Parse and validate pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        // Run count and query in parallel
        const [totalCount, donations] = await Promise.all([
            FoodDonation.countDocuments({ donorId }),
            FoodDonation.find({ donorId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            count: donations.length,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: donations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve donations.",
        });
    }
};

/**
 * @desc    Get donor history list with filtering and pagination
 * @route   GET /api/v1/donations/history
 * @access  Private (Donor only)
 */
export const getDonorHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;

        // Safety Check: Validate that donorId is a valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(donorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }

        // Parse query parameters
        const { type = "all", page = 1, limit = 10, status } = req.query;

        // Validate type parameter
        if (type !== "all" && type !== "donation" && type !== "request") {
            return res.status(400).json({
                success: false,
                message: "Invalid type parameter. Must be 'donation', 'request', or 'all'",
            });
        }

        // Validate pagination parameters
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;

        let historyRecords = [];
        let totalCount = 0;

        // Query 1: From DonationHistory collection (completed/expired/cancelled donations)
        if (type === "donation" || type === "all") {
            const donationHistoryFilter = { donorId };

            // Apply status filter on finalStatus if provided
            if (status) {
                donationHistoryFilter.finalStatus = status;
            }

            const [donationHistoryResults, donationHistoryCount] = await Promise.all([
                DonationHistory.find(donationHistoryFilter)
                    .populate({
                        path: "donationId",
                        select: "foodName category quantity preparedAt expiryAt pickupAddress pickupTime status",
                    })
                    .populate({
                        path: "ngoId",
                        select: "name organizationName city",
                    })
                    .populate({
                        path: "requestId",
                        select: "requestedQuantity message status requestedAt respondedAt",
                    })
                    .sort({ createdAt: -1 })
                    .lean(),
                DonationHistory.countDocuments(donationHistoryFilter),
            ]);

            const donationMapped = donationHistoryResults.map((record) => ({
                _id: record._id,
                type: "donation",
                foodName: record.donationId?.foodName || "Unknown Food",
                ngoName: record.ngoId?.organizationName || record.ngoId?.name || "Unknown NGO",
                ngoCity: record.ngoId?.city || "Unknown City",
                status: record.finalStatus,
                date: record.completedAt || record.createdAt,
                quantity: record.donationId?.quantity || "Unknown Quantity",
                requestedQuantity: record.requestId?.requestedQuantity || null,
                message: record.requestId?.message || null,
                rating: record.rating,
                feedback: record.feedback,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            }));

            historyRecords = [...historyRecords, ...donationMapped];
            totalCount += donationHistoryCount;
        }

        // Query 2: From DonationRequest collection (rejected/cancelled/pending requests)
        if (type === "request" || type === "all") {
            const requestFilter = { donorId };

            // Apply status filter if provided
            if (status) {
                requestFilter.status = status;
            }

            const [requestResults, requestCount] = await Promise.all([
                DonationRequest.find(requestFilter)
                    .populate({
                        path: "donationId",
                        select: "foodName category quantity preparedAt expiryAt pickupAddress pickupTime status",
                    })
                    .populate({
                        path: "ngoId",
                        select: "name organizationName city",
                    })
                    .sort({ requestedAt: -1 })
                    .lean(),
                DonationRequest.countDocuments(requestFilter),
            ]);

            const requestMapped = requestResults.map((record) => ({
                _id: record._id,
                type: "request",
                foodName: record.donationId?.foodName || "Unknown Food",
                ngoName: record.ngoId?.organizationName || record.ngoId?.name || "Unknown NGO",
                ngoCity: record.ngoId?.city || "Unknown City",
                status: record.status,
                date: record.requestedAt,
                quantity: record.donationId?.quantity || "Unknown Quantity",
                requestedQuantity: record.requestedQuantity,
                message: record.message,
                rating: null,
                feedback: null,
                createdAt: record.requestedAt,
                updatedAt: record.updatedAt,
            }));

            historyRecords = [...historyRecords, ...requestMapped];
            totalCount += requestCount;
        }

        // Sort all records by date descending
        historyRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Apply pagination to the combined sorted results
        const paginatedResults = historyRecords.slice(skip, skip + limitNum);

        return res.status(200).json({
            success: true,
            count: paginatedResults.length,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            data: paginatedResults,
        });
    } catch (error) {
        console.error("Error in getDonorHistory:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve donor history.",
        });
    }
};

/**
 * @desc    Complete a donation workflow after all accepted requests are picked up
 * @route   PATCH /api/v1/donations/:id/complete
 * @access  Private (Donor only)
 */
export const completeDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const donorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation ID format",
            });
        }

        const donation = await FoodDonation.findOne({
            _id: id,
            donorId,
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found or access denied",
            });
        }

        if (donation.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Donation is already completed.",
            });
        }

        // Find all requests associated with this donation.
        const donationRequests = await DonationRequest.find({
            donationId: id,
        }).lean();

        if (donationRequests.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No donation requests found for this donation.",
            });
        }

        // Every request that was accepted must have its pickup confirmed.
        const pendingPickups = donationRequests.filter(
            (request) =>
                request.status === "accepted" &&
                !request.pickupConfirmed
        );

        if (pendingPickups.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${pendingPickups.length} accepted donation request(s) have not confirmed pickup yet.`,
            });
        }

        // At this point all accepted requests have completed pickup.
        await FoodDonation.findByIdAndUpdate(id, {
            status: "completed",
        });

        return res.status(200).json({
            success: true,
            message: "Donation completed successfully.",
            data: {
                donationId: id,
                completionStatus: "Completed",
                completedAt: new Date(),
            },
        });
    } catch (error) {
        console.error("Error in completeDonation:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to complete donation workflow.",
        });
    }
};

/**
 * @desc    Get current donation status
 * @route   GET /api/v1/donations/:id/status
 * @access  Private (Donor & NGO)
 */
export const getDonationStatus = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Donation status retrieved successfully.",
            data: {
                donationId: donation._id,
                status: donation.status,
                updatedAt: donation.updatedAt,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
        });
    }
};


/**
 * @desc    Update donation status
 * @route   PATCH /api/v1/donations/:id/status
 * @access  Private (Donor)
 */
export const updateDonationStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "available",
            "requested",
            "accepted",
            "picked_up",
            "completed",
            "expired",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation status.",
            });
        }

        const donation = await FoodDonation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found.",
            });
        }

        // Owner check
        if (donation.donorId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // Prevent changing completed donation
        if (donation.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed donation cannot be updated.",
            });
        }

        donation.status = status;

        await donation.save();

        return res.status(200).json({
            success: true,
            message: "Donation status updated successfully.",
            data: {
                donationId: donation._id,
                status: donation.status,
                updatedAt: donation.updatedAt,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
        });

    }
};

/**
 * @desc    Delete a donation
 * @route   DELETE /api/v1/donations/:id
 * @access  Private (Donor only)
 */
export const deleteDonation = async (req, res) => {
    try {

        const { id } = req.params;
        const donorId = req.user.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation ID.",
            });
        }

        // Find donation
        const donation = await FoodDonation.findById(id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found.",
            });
        }

        // Ownership check
        if (donation.donorId.toString() !== donorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // Prevent deletion after workflow has started
        const blockedStatuses = [
            "accepted",
            "picked_up",
            "completed",
        ];

        if (blockedStatuses.includes(donation.status)) {
            return res.status(400).json({
                success: false,
                message:
                    "This donation cannot be deleted because it is already in progress.",
            });
        }

        // Delete pending requests
        await DonationRequest.deleteMany({
            donationId: donation._id,
        });

        // Delete donation
        await FoodDonation.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Donation deleted successfully.",
        });

    } catch (error) {

        console.error("Error deleting donation:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });

    }
};

/**
 * @desc    Update donation
 * @route   PUT /api/v1/donations/:id
 * @access  Private (Donor only)
 */
export const updateDonation = async (req, res) => {
    try {

        const { id } = req.params;
        const donorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation ID.",
            });
        }

        const donation = await FoodDonation.findById(id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found.",
            });
        }

        if (donation.donorId.toString() !== donorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const blockedStatuses = [
            "accepted",
            "picked_up",
            "completed",
        ];

        if (blockedStatuses.includes(donation.status)) {
            return res.status(400).json({
                success: false,
                message:
                    "This donation can no longer be edited.",
            });
        }

        donation.foodName =
            req.body.foodName ?? donation.foodName;

        donation.category =
            req.body.category ?? donation.category;

        donation.quantity =
            req.body.quantity ?? donation.quantity;

        donation.preparedAt =
            req.body.preparedAt ?? donation.preparedAt;

        donation.pickupAddress =
            req.body.pickupAddress ?? donation.pickupAddress;

        donation.pickupTime =
            req.body.pickupTime ?? donation.pickupTime;

        donation.description =
            req.body.description ?? donation.description;

        const updatedDonation =
            await donation.save();

        return res.status(200).json({
            success: true,
            message:
                "Donation updated successfully.",
            data: updatedDonation,
        });

    } catch (error) {

        console.error(
            "Error updating donation:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });

    }
};

/**
 * @desc    Get single history item details
 * @route   GET /api/v1/donations/history/:id
 * @access  Private (Donor only)
 */
export const getDonorHistoryById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;
        const { id } = req.params;

        // Safety Check: Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid history ID format",
            });
        }

        // Try to find in DonationHistory first
        let historyRecord = await DonationHistory.findById(id)
            .populate({
                path: "donationId",
                select: "foodName category quantity preparedAt expiryAt pickupAddress pickupTime status description",
            })
            .populate({
                path: "ngoId",
                select: "name organizationName city address",
            })
            .populate({
                path: "requestId",
                select: "requestedQuantity message status requestedAt respondedAt pickupConfirmed",
            })
            .populate({
                path: "donorId",
                select: "name phone organizationName city email",
            })
            .lean();

        // If not found in DonationHistory, try DonationRequest (for rejected/cancelled requests)
        if (!historyRecord) {
            historyRecord = await DonationRequest.findById(id)
                .populate({
                    path: "donationId",
                    select: "foodName category quantity preparedAt expiryAt pickupAddress pickupTime status description",
                })
                .populate({
                    path: "ngoId",
                    select: "name organizationName city address",
                })
                .populate({
                    path: "donorId",
                    select: "name phone organizationName city email",
                })
                .lean();

            // Verify this request belongs to the authenticated donor
            if (!historyRecord || !historyRecord.donorId || historyRecord.donorId._id.toString() !== donorId) {
                return res.status(404).json({
                    success: false,
                    message: "History record not found or access denied",
                });
            }

            // Transform request record to match history format
            return res.status(200).json({
                success: true,
                data: {
                    _id: historyRecord._id,
                    type: "request",
                    donationDetails: historyRecord.donationId,
                    ngoDetails: historyRecord.ngoId,
                    foodName: historyRecord.donationId?.foodName || "Unknown Food",
                    ngoName: historyRecord.ngoId?.organizationName || historyRecord.ngoId?.name || "Unknown NGO",
                    ngoCity: historyRecord.ngoId?.city || "Unknown City",
                    ngoAddress: historyRecord.ngoId?.address || "Unknown Address",
                    status: historyRecord.status,
                    date: historyRecord.requestedAt,
                    quantity: historyRecord.donationId?.quantity || "Unknown Quantity",
                    requestedQuantity: historyRecord.requestedQuantity,
                    message: historyRecord.message,
                    rating: null,
                    feedback: null,
                    requestedAt: historyRecord.requestedAt,
                    respondedAt: historyRecord.respondedAt,
                    pickupConfirmed: historyRecord.pickupConfirmed,
                    createdAt: historyRecord.createdAt,
                    updatedAt: historyRecord.updatedAt,
                },
            });
        }

        // Verify this history record belongs to the authenticated donor 
        if (!historyRecord.donorId || historyRecord.donorId._id.toString() !== donorId) {
            return res.status(404).json({
                success: false,
                message: "History record not found or access denied",
            });
        }

        // Transform history record to consistent format
        return res.status(200).json({
            success: true,
            data: {
                _id: historyRecord._id,
                type: "donation",
                donationDetails: historyRecord.donationId,
                ngoDetails: historyRecord.ngoId,
                requestDetails: historyRecord.requestId,
                foodName: historyRecord.donationId?.foodName || "Unknown Food",
                ngoName: historyRecord.ngoId?.organizationName || historyRecord.ngoId?.name || "Unknown NGO",
                ngoCity: historyRecord.ngoId?.city || "Unknown City",
                ngoAddress: historyRecord.ngoId?.address || "Unknown Address",
                status: historyRecord.finalStatus,
                date: historyRecord.completedAt || historyRecord.createdAt,
                quantity: historyRecord.donationId?.quantity || "Unknown Quantity",
                requestedQuantity: historyRecord.requestId?.requestedQuantity || null,
                message: historyRecord.requestId?.message || null,
                rating: historyRecord.rating,
                feedback: historyRecord.feedback,
                createdAt: historyRecord.createdAt,
                updatedAt: historyRecord.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error in getDonorHistoryById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve history details.",
        });
    }
};
