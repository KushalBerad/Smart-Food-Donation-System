import mongoose from "mongoose";
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

        // Pagination parameters
        let page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        if (limit > 50) limit = 50;
        const skip = (page - 1) * limit;

        // Filter by donorId and status 'pending' (unless other status is provided)
        const statusFilter = req.query.status || "pending";
        const filter = {
            donorId,
            status: statusFilter
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
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        // Query and populate details
        const request = await DonationRequest.findById(id)
            .populate({
                path: "donationId",
                select: "foodName quantity preparedAt pickupAddress pickupTime description",
            })
            .populate({
                path: "ngoId",
                select: "name phone organizationName",
            })
            .lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found",
            });
        }

        // Security Check: User must be either the donor or the NGO associated with the request
        const ngoId =
            request.ngoId?._id
                ? request.ngoId._id.toString()
                : request.ngoId.toString();

        if (
            request.donorId.toString() !== userId &&
            ngoId !== userId
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not authorized to view this request.",
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
    try {
        const { id } = req.params;
        const donorId = req.user.id;
        const { quantity } = req.body; // Quantity being accepted/fulfilled

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        // Validate quantity parameter
        if (quantity === undefined || quantity === null || quantity === '') {
            return res.status(400).json({
                success: false,
                message: "Quantity to accept is required",
            });
        }

        const quantityToAccept = parseInt(quantity, 10);
        if (isNaN(quantityToAccept) || quantityToAccept <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity. Must be a positive number",
            });
        }

        const request = await DonationRequest.findOne({
            _id: id,
            donorId,
        }).lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found or access denied",
            });
        }

        const donation = await FoodDonation.findById(
            request.donationId
        ).select("foodName quantity remainingQuantity status");

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot accept request with status '${request.status}'. It must be pending.`,
            });
        }

        // Validate that requested quantity doesn't exceed what's available in the request
        const requestedQuantityInt = parseInt(request.requestedQuantity, 10);
        if (isNaN(requestedQuantityInt) || requestedQuantityInt <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid requested quantity in request",
            });
        }

        if (quantityToAccept > requestedQuantityInt) {
            return res.status(400).json({
                success: false,
                message: `Cannot accept ${quantityToAccept} meals. Requested quantity is only ${requestedQuantityInt} meals.`,
            });
        }

        // Validate against the donation's currently available remaining quantity
        const currentRemaining = donation.remainingQuantity ?? 0;
        if (quantityToAccept > currentRemaining) {
            return res.status(400).json({
                success: false,
                message: `Cannot accept ${quantityToAccept} meals. Only ${currentRemaining} meal(s) remain available for this donation.`,
            });
        }

        // 1. Update DonationRequest status and set fulfilledQuantity to accepted quantity
        const updatedRequest = await DonationRequest.findByIdAndUpdate(
            id,
            {
                status: "accepted",
                respondedAt: new Date(),
                fulfilledQuantity: quantityToAccept
            },
            { new: true }
        );

        // 2. Decrement the donation's remaining quantity atomically
        const newRemainingQuantity = currentRemaining - quantityToAccept;
        const totalQuantity = parseInt(donation.quantity, 10);

        // 3. Update FoodDonation status based on remaining quantity
        let newStatus = donation.status; // Default to current status
        if (newRemainingQuantity <= 0) {
            newStatus = "completed";
            // If donation is fully claimed, reject all other pending requests
            await DonationRequest.updateMany(
                {
                    donationId: request.donationId,
                    status: "pending"
                },
                {
                    status: "rejected",
                    respondedAt: new Date()
                }
            );
        } else {
            newStatus = "accepted"; // Remains open so other NGOs can still claim the remainder
        }

        await FoodDonation.findByIdAndUpdate(request.donationId, {
            status: newStatus,
            remainingQuantity: Math.max(newRemainingQuantity, 0)
        }, { new: true });

        // 4. Notify the NGO
        await Notification.create({
            userId: request.ngoId,
            type: "accepted",
            title: "Donation Request Accepted",
            message: `Your request for ${quantityToAccept} meal(s) of ${donation?.foodName || "food items"
                } has been accepted by the donor.`,
        });

        return res.status(200).json({
            success: true,
            message: "Donation request accepted successfully",
            data: {
                ...updatedRequest._doc,
                acceptedQuantity: quantityToAccept,
                remainingQuantity: Math.max(newRemainingQuantity, 0)
            }
        });
    } catch (error) {
        console.error("Error in acceptRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to accept request.",
        });
    }
};

/**
 * @desc    Confirm pickup of a donation by NGO
 * @route   PATCH /api/v1/requests/:id/pickup
 * @access  Private (NGO only)
 */
export const confirmPickup = async (req, res) => {
    try {
        const { id } = req.params;
        const ngoId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format",
            });
        }

        // Find request and ensure it belongs to the authenticated NGO
        const request = await DonationRequest.findById(id).lean();


        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found",
            });
        }

        if (request.ngoId.toString() !== ngoId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. This request does not belong to your NGO.",
            });
        }

        if (request.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: `Cannot confirm pickup for request with status '${request.status}'. It must be 'accepted'.`,
            });
        }

        // Update pickup confirmation
        const updatedRequest = await DonationRequest.findByIdAndUpdate(
            id,
            { pickupConfirmed: true },
            { new: true }
        );
        await FoodDonation.findByIdAndUpdate(
            request.donationId,
            {
                status: "picked_up",
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Pickup confirmed successfully.",
            data: {
                donationId: request.donationId,
                requestId: request._id,
                pickupStatus: "Picked Up",
            },
        });
    } catch (error) {
        console.error("Error in confirmPickup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to confirm pickup.",
        });
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

        const request = await DonationRequest.findOne({ _id: id, donorId }).lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Donation request not found or access denied",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject request with status '${request.status}'. It must be pending.`,
            });
        }

        // 1. Update DonationRequest status
        const updatedRequest = await DonationRequest.findByIdAndUpdate(
            id,
            {
                status: "rejected",
                respondedAt: new Date()
            },
            { new: true }
        );

        // 2. Recalculate total claimed quantity from all accepted requests for this donation
        const acceptedRequests = await DonationRequest.find({
            donationId: request.donationId,
            status: "accepted"
        });

        let totalClaimed = 0;
        for (const req of acceptedRequests) {
            totalClaimed += parseInt(req.fulfilledQuantity, 10);
        }

        const donation = await FoodDonation.findById(request.donationId);
        const totalQuantity = parseInt(donation.quantity, 10);
        const remainingQuantity = totalQuantity - totalClaimed;

        // 3. Update FoodDonation status based on remaining quantity
        let newStatus = donation.status; // Default to current status
        if (remainingQuantity <= 0) {
            newStatus = "completed";
        } else if (totalClaimed > 0) {
            // Some claims still exist, so the listing remains open/partially claimed
            newStatus = "accepted";
        } else {
            // No claims remain - reset back to available so NGOs can browse it again
            newStatus = "available";
        }

        await FoodDonation.findByIdAndUpdate(request.donationId, {
            status: newStatus,
            remainingQuantity: Math.max(remainingQuantity, 0)
        });

        // 4. Notify the NGO
        await Notification.create({
            userId: request.ngoId,
            type: "rejected",
            title: "Donation Request Rejected",
            message: `Your request for ${donation?.foodName || "food items"
                } has been rejected by the donor.`,
        });

        return res.status(200).json({
            success: true,
            message: "Donation request rejected successfully",
            data: updatedRequest,
        });
    } catch (error) {
        console.error("Error in rejectRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to reject request.",
        });
    }
};
