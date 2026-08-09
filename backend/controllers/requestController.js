import mongoose from "mongoose";
import DonationHistory from "../models/DonationHistory.js";
import DonationRequest from "../models/DonationRequest.js";
import FoodDonation from "../models/FoodDonation.js";
import Notification from "../models/Notification.js";

/**
 * @desc    Fetch pending donation requests for the authenticated donor
 * @route   GET /api/v1/donations/requests
 * @access  Private (Donor only)
 */
export const getPendingRequests = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;

        // Validate pagination parameters
        const requestedPage = parseInt(req.query.page, 10);
        const requestedLimit = parseInt(req.query.limit, 10);

        const page =
            Number.isInteger(requestedPage) && requestedPage > 0
                ? requestedPage
                : 1;

        const limit =
            Number.isInteger(requestedLimit) && requestedLimit > 0
                ? Math.min(requestedLimit, 50)
                : 10;

        const skip = (page - 1) * limit;

        // Only allow valid donation request statuses
        const allowedStatuses = [
            "pending",
            "accepted",
            "rejected",
            "cancelled",
            "completed",
        ];

        const statusFilter = req.query.status || "pending";

        if (!allowedStatuses.includes(statusFilter)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request status.",
            });
        }

        const filter = {
            donorId,
            status: statusFilter,
        };

        const [totalCount, requests] = await Promise.all([
            DonationRequest.countDocuments(filter),

            DonationRequest.find(filter)
                .populate({
                    path: "ngoId",
                    select: "name organizationName city email",
                })
                .populate({
                    path: "donationId",
                    select: "foodName quantity status",
                })
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            count: requests.length,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: requests,
        });
    } catch (error) {
        console.error("Error in getPendingRequests:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to fetch requests.",
        });
    }
};

/**
 * @desc    Get detailed information of a specific donation request
 * @route   GET /api/v1/donations/requests/:id
 * @access  Private (Donor or NGO)
 */
export const getRequestDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const donorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        const request = await DonationRequest.findOne({
            _id: id,
            donorId,
        })
            .populate({
                path: "ngoId",
                select: "name organizationName city email phone",
            })
            .populate({
                path: "donationId",
                select:
                    "foodName category quantity remainingQuantity preparedAt expiryAt pickupAddress pickupTime description status",
            })
            .lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found or access denied",
            });
        }

        return res.status(200).json({
            success: true,
            data: request,
        });
    } catch (error) {
        console.error("Error in getRequestDetails:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve request details.",
        });
    }
};

/**
 * @desc    Accept an NGO donation request (supports partial fulfillment)
 * @route   PATCH /api/v1/donations/requests/:id/accept
 * @access  Private (Donor only)
 */
export const acceptRequest = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;
        const donorId = req.user.id;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        const quantityToAccept = Number(quantity);

        if (
            quantity === undefined ||
            quantity === null ||
            quantity === "" ||
            !Number.isInteger(quantityToAccept) ||
            quantityToAccept <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity to accept must be a positive whole number.",
            });
        }

        let result;

        await session.withTransaction(async () => {
            /*
             * Find the pending request belonging to this donor.
             */
            const request = await DonationRequest.findOne({
                _id: id,
                donorId,
                status: "pending",
            })
                .session(session)
                .lean();

            if (!request) {
                throw Object.assign(
                    new Error("Donation request not found, access denied, or request is no longer pending."),
                    { statusCode: 404 }
                );
            }

            const requestedQuantity = Number(request.requestedQuantity);

            if (
                !Number.isInteger(requestedQuantity) ||
                requestedQuantity <= 0
            ) {
                throw Object.assign(
                    new Error("Invalid requested quantity in donation request."),
                    { statusCode: 400 }
                );
            }

            if (quantityToAccept > requestedQuantity) {
                throw Object.assign(
                    new Error(
                        `Cannot accept ${quantityToAccept} meal(s). Requested quantity is only ${requestedQuantity} meal(s).`
                    ),
                    { statusCode: 400 }
                );
            }

            /*
             * Read the associated donation inside the same transaction.
             */
            const donation = await FoodDonation.findById(request.donationId)
                .session(session)
                .lean();

            if (!donation) {
                throw Object.assign(
                    new Error("Associated donation not found."),
                    { statusCode: 404 }
                );
            }

            const currentRemaining = Number(donation.remainingQuantity);

            if (
                !Number.isInteger(currentRemaining) ||
                currentRemaining < 0
            ) {
                throw Object.assign(
                    new Error("Donation has an invalid remaining quantity."),
                    { statusCode: 400 }
                );
            }

            if (quantityToAccept > currentRemaining) {
                throw Object.assign(
                    new Error(
                        `Cannot accept ${quantityToAccept} meal(s). Only ${currentRemaining} meal(s) remain available for this donation.`
                    ),
                    { statusCode: 400 }
                );
            }

            if (
                !["available", "requested", "accepted"].includes(
                    donation.status
                )
            ) {
                throw Object.assign(
                    new Error(
                        `Cannot accept this request because the donation status is '${donation.status}'.`
                    ),
                    { statusCode: 400 }
                );
            }

            const newRemainingQuantity =
                currentRemaining - quantityToAccept;

            const newDonationStatus = "accepted";

            /*
             * Atomically reserve the requested quantity.
             *
             * The remainingQuantity condition prevents another concurrent
             * acceptance from consuming the same quantity.
             */
            const updatedDonation =
                await FoodDonation.findOneAndUpdate(
                    {
                        _id: request.donationId,
                        status: {
                            $in: ["available", "requested", "accepted"],
                        },
                        remainingQuantity: {
                            $gte: quantityToAccept,
                        },
                    },
                    {
                        $set: {
                            remainingQuantity: newRemainingQuantity,
                            status: newDonationStatus,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                ).lean();

            if (!updatedDonation) {
                throw Object.assign(
                    new Error(
                        "The donation quantity changed while processing this request. Please refresh and try again."
                    ),
                    { statusCode: 409 }
                );
            }

            /*
             * Mark this specific request as accepted only while it is still
             * pending. This protects against duplicate acceptance attempts.
             */
            const updatedRequest =
                await DonationRequest.findOneAndUpdate(
                    {
                        _id: request._id,
                        donorId,
                        status: "pending",
                    },
                    {
                        $set: {
                            status: "accepted",
                            fulfilledQuantity: quantityToAccept,
                            respondedAt: new Date(),
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                ).lean();

            if (!updatedRequest) {
                throw Object.assign(
                    new Error(
                        "This donation request was already processed. No quantity was allocated."
                    ),
                    { statusCode: 409 }
                );
            }

            /*
             * If the donation has been completely allocated, no pending
             * NGO request can still be fulfilled from it.
             */
            if (newRemainingQuantity === 0) {
                await DonationRequest.updateMany(
                    {
                        donationId: request.donationId,
                        status: "pending",
                        _id: { $ne: request._id },
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

            result = {
                request: updatedRequest,
                donation: updatedDonation,
                acceptedQuantity: quantityToAccept,
            };
        });

        /*
         * Create the notification only after the transaction succeeds.
         */
        await Notification.create({
            userId: result.request.ngoId,
            type: "accepted",
            title: "Donation Request Accepted",
            message: `Your request for ${result.acceptedQuantity} meal(s) has been accepted by the donor.`,
        });

        return res.status(200).json({
            success: true,
            message: "Donation request accepted successfully.",
            data: {
                ...result.request,
                acceptedQuantity: result.acceptedQuantity,
                remainingQuantity: result.donation.remainingQuantity,
                donationStatus: result.donation.status,
            },
        });
    } catch (error) {
        console.error("Error in acceptRequest:", error);

        const statusCode =
            Number.isInteger(error.statusCode) &&
                error.statusCode >= 400 &&
                error.statusCode < 500
                ? error.statusCode
                : 500;

        return res.status(statusCode).json({
            success: false,
            message:
                statusCode === 500
                    ? "Internal server error. Failed to accept donation request."
                    : error.message,
        });
    } finally {
        await session.endSession();
    }
};

/**
 * @desc    Confirm pickup of a donation by NGO
 * @route   PATCH /api/v1/requests/:id/pickup
 * @access  Private (NGO only)
 */
export const confirmPickup = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;
        const ngoId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        let result;

        await session.withTransaction(async () => {
            /*
             * Find the request belonging to this NGO.
             */
            const request = await DonationRequest.findOne({
                _id: id,
                ngoId,
            })
                .session(session)
                .lean();

            if (!request) {
                throw Object.assign(
                    new Error("Donation request not found or access denied."),
                    { statusCode: 404 }
                );
            }

            if (request.status !== "accepted") {
                throw Object.assign(
                    new Error(
                        `Cannot confirm pickup for request with status '${request.status}'. It must be 'accepted'.`
                    ),
                    { statusCode: 400 }
                );
            }

            if (request.pickupConfirmed) {
                throw Object.assign(
                    new Error("Pickup has already been confirmed for this request."),
                    { statusCode: 400 }
                );
            }

            /*
             * Verify that the associated donation still exists.
             */
            const donation = await FoodDonation.findById(request.donationId)
                .select("foodName quantity remainingQuantity status donorId")
                .session(session)
                .lean();

            if (!donation) {
                throw Object.assign(
                    new Error("Associated donation not found."),
                    { statusCode: 404 }
                );
            }

            /*
             * Atomically confirm pickup for this specific request.
             *
             * The status/pickupConfirmed conditions prevent duplicate
             * pickup confirmations.
             */
            const updatedRequest = await DonationRequest.findOneAndUpdate(
                {
                    _id: id,
                    ngoId,
                    status: "accepted",
                    pickupConfirmed: false,
                },
                {
                    $set: {
                        status: "completed",
                        pickupConfirmed: true,
                        respondedAt: new Date(),
                    },
                },
                {
                    new: true,
                    session,
                }
            ).lean();

            if (!updatedRequest) {
                throw Object.assign(
                    new Error(
                        "Pickup has already been confirmed or the request is no longer eligible."
                    ),
                    { statusCode: 409 }
                );
            }

            /*
             * Create exactly one history record for this completed request.
             */
            const existingHistory = await DonationHistory.findOne({
                requestId: updatedRequest._id,
                donationId: updatedRequest.donationId,
            })
                .session(session)
                .lean();

            if (!existingHistory) {
                await DonationHistory.create(
                    [
                        {
                            requestId: updatedRequest._id,
                            donationId: updatedRequest.donationId,
                            donorId: updatedRequest.donorId,
                            ngoId: updatedRequest.ngoId,
                            fulfilledQuantity:
                                updatedRequest.fulfilledQuantity || 0,
                            finalStatus: "completed",
                            completedAt: new Date(),
                        },
                    ],
                    { session }
                );
            }

            /*
             * Check whether any other accepted NGO requests still exist
             * for this donation.
             */
            const remainingAcceptedRequests =
                await DonationRequest.countDocuments({
                    donationId: updatedRequest.donationId,
                    status: "accepted",
                }).session(session);

            let newDonationStatus;

            if (remainingAcceptedRequests > 0) {
                /*
                 * Other NGOs still have accepted allocations.
                 * The donation must remain in the accepted state.
                 */
                newDonationStatus = "accepted";
            } else if (Number(donation.remainingQuantity) > 0) {
                /*
                 * All currently accepted allocations have been picked up,
                 * but some food remains available for future requests.
                 */
                newDonationStatus = "available";
            } else {
                /*
                 * No accepted allocations remain and no food remains.
                 */
                newDonationStatus = "completed";
            }

            const updatedDonation = await FoodDonation.findByIdAndUpdate(
                updatedRequest.donationId,
                {
                    $set: {
                        status: newDonationStatus,
                    },
                },
                {
                    new: true,
                    session,
                }
            ).lean();

            result = {
                request: updatedRequest,
                donation: updatedDonation,
                remainingAcceptedRequests,
            };
        });

        return res.status(200).json({
            success: true,
            message:
                result.donation.status === "completed"
                    ? "Pickup confirmed and donation completed successfully."
                    : "Pickup confirmed successfully.",
            data: {
                donationId: result.request.donationId,
                requestId: result.request._id,
                pickupStatus: "Picked Up",
                pickupConfirmed: true,
                requestStatus: result.request.status,
                donationStatus: result.donation.status,
                remainingQuantity: result.donation.remainingQuantity,
                remainingAcceptedRequests:
                    result.remainingAcceptedRequests,
            },
        });
    } catch (error) {
        console.error("Error in confirmPickup:", error);

        const statusCode =
            Number.isInteger(error.statusCode) &&
                error.statusCode >= 400 &&
                error.statusCode < 500
                ? error.statusCode
                : 500;

        return res.status(statusCode).json({
            success: false,
            message:
                statusCode === 500
                    ? "Internal server error. Failed to confirm pickup."
                    : error.message,
        });
    } finally {
        await session.endSession();
    }
};

/**
 * @desc    Reject an NGO donation request
 * @route   PATCH /api/v1/donations/requests/:id/reject
 * @access  Private (Donor only)
 */
export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const donorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        /*
         * Find the request belonging to the authenticated donor.
         */
        const request = await DonationRequest.findOne({
            _id: id,
            donorId,
        }).lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found or access denied.",
            });
        }

        /*
         * Only pending requests can be rejected.
         *
         * Accepted requests have already consumed an allocation and
         * must not be handled through this endpoint.
         */
        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject request with status '${request.status}'. It must be pending.`,
            });
        }

        /*
         * Verify that the associated donation still exists.
         */
        const donation = await FoodDonation.findById(request.donationId)
            .select("foodName status remainingQuantity")
            .lean();

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Associated donation not found.",
            });
        }

        /*
         * Reject only this pending request.
         *
         * IMPORTANT:
         * A pending request has not consumed any donation quantity,
         * so remainingQuantity and donation status must not be changed.
         */
        const updatedRequest = await DonationRequest.findOneAndUpdate(
            {
                _id: id,
                donorId,
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

        if (!updatedRequest) {
            return res.status(409).json({
                success: false,
                message: "Request was already processed or is no longer pending.",
            });
        }

        /*
         * Notify the NGO.
         */
        await Notification.create({
            userId: request.ngoId,
            type: "rejected",
            title: "Donation Request Rejected",
            message: `Your request for ${donation.foodName || "food items"
                } has been rejected by the donor.`,
        });

        return res.status(200).json({
            success: true,
            message: "Donation request rejected successfully.",
            data: {
                requestId: updatedRequest._id,
                donationId: updatedRequest.donationId,
                status: updatedRequest.status,
                remainingQuantity: donation.remainingQuantity,
            },
        });
    } catch (error) {
        console.error("Error in rejectRequest:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to reject request.",
        });
    }
};