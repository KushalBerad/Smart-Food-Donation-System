import mongoose from "mongoose";
import DonationRequest from "../models/DonationRequest.js";
import FoodDonation from "../models/FoodDonation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

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
        if (request.donorId.toString() !== userId && request.ngoId.toString() !== userId) {
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
 * @desc    Accept an NGO donation request
 * @route   PATCH /api/v1/donations/requests/:id/accept
 * @access  Private (Donor only)
 */
export const acceptRequest = async (req, res) => {
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
                message: `Cannot accept request with status '${request.status}'. It must be pending.`,
            });
        }

        // 1. Update DonationRequest status
        const updatedRequest = await DonationRequest.findByIdAndUpdate(
            id,
            { 
                status: "accepted", 
                respondedAt: new Date() 
            },
            { new: true }
        );

        // 2. Update associated FoodDonation status to 'accepted'
        await FoodDonation.findByIdAndUpdate(request.donationId, { 
            status: "accepted" 
        });

        // 3. Notify the NGO
        await Notification.create({
            userId: request.ngoId,
            type: "accepted",
            title: "Donation Request Accepted",
            message: `Your request for ${request.donationId.foodName || "food items"} has been accepted by the donor.`,
        });

        return res.status(200).json({
            success: true,
            message: "Donation request accepted successfully",
            data: updatedRequest,
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

        // 2. Check if other pending requests exist for this food item
        const otherPendingRequests = await DonationRequest.countDocuments({
            donationId: request.donationId,
            status: "pending",
            _id: { $ne: id }
        });

        // If no other pending requests, set food status back to 'available'
        if (otherPendingRequests === 0) {
            await FoodDonation.findByIdAndUpdate(request.donationId, { 
                status: "available" 
            });
        }

        // 3. Notify the NGO
        await Notification.create({
            userId: request.ngoId,
            type: "rejected",
            title: "Donation Request Rejected",
            message: `Your request for ${request.donationId.foodName || "food items"} has been rejected by the donor.`,
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