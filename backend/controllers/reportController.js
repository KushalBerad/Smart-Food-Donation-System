import mongoose from "mongoose";
import FoodDonation from "../models/FoodDonation.js";
import DonationRequest from "../models/DonationRequest.js";
import DonationHistory from "../models/DonationHistory.js";

/**
 * @desc    Get impact statistics for the authenticated user (Donor or NGO)
 * @route   GET /api/v1/reports
 * @access  Private (Donor & NGO)
 */
export const getImpactStatistics = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        let stats = {};

        if (userRole === "donor") {
            // ─── Donor Statistics ────────────────────────────────

            // Total donations created by this donor
            const totalDonations = await FoodDonation.countDocuments({ donorId: userId });

            // Completed donations
            const completedDonations = await FoodDonation.countDocuments({
                donorId: userId,
                status: "completed",
            });

            // Pending donations (available or requested status)
            const pendingDonations = await FoodDonation.countDocuments({
                donorId: userId,
                status: { $in: ["available", "requested"] },
            });

            // Accepted requests (requests where donor accepted)
            const acceptedRequests = await DonationRequest.countDocuments({
                donorId: userId,
                status: "accepted",
            });

            // Rejected requests
            const rejectedRequests = await DonationRequest.countDocuments({
                donorId: userId,
                status: "rejected",
            });

            // Total meals donated: aggregate numeric values from quantity strings
            // Parse quantity strings like "5 kg", "10 plates", "3" to extract numbers
            const donationDocs = await FoodDonation.find({
                donorId: userId,
                status: { $in: ["completed", "accepted"] },
            })
                .select("quantity")
                .lean();

            let totalMealsDonated = 0;
            for (const doc of donationDocs) {
                if (doc.quantity) {
                    // Extract the leading number from quantity string
                    const match = doc.quantity.match(/^(\d+(?:\.\d+)?)/);
                    if (match) {
                        totalMealsDonated += parseFloat(match[1]);
                    }
                }
            }

            stats = {
                totalDonations,
                totalMealsDonated,
                completedDonations,
                pendingDonations,
                acceptedRequests,
                rejectedRequests,
            };
        } else if (userRole === "ngo") {
            // ─── NGO Statistics ──────────────────────────────────

            // Total requests made by this NGO
            const totalRequests = await DonationRequest.countDocuments({ ngoId: userId });

            // Completed requests (status = 'completed')
            const completedRequests = await DonationRequest.countDocuments({
                ngoId: userId,
                status: "completed",
            });

            // Pending requests (status = 'pending')
            const pendingRequests = await DonationRequest.countDocuments({
                ngoId: userId,
                status: "pending",
            });

            // Accepted requests
            const acceptedRequests = await DonationRequest.countDocuments({
                ngoId: userId,
                status: "accepted",
            });

            // Rejected requests
            const rejectedRequests = await DonationRequest.countDocuments({
                ngoId: userId,
                status: "rejected",
            });

            // Total meals received: aggregate from completed requests' donation quantities
            const completedRequestDocs = await DonationRequest.find({
                ngoId: userId,
                status: "completed",
            })
                .populate({
                    path: "donationId",
                    select: "quantity",
                })
                .lean();

            let totalMealsReceived = 0;
            for (const doc of completedRequestDocs) {
                const qty = doc.donationId?.quantity;
                if (qty) {
                    const match = qty.match(/^(\d+(?:\.\d+)?)/);
                    if (match) {
                        totalMealsReceived += parseFloat(match[1]);
                    }
                }
            }

            // Total unique donations this NGO has interacted with
            const uniqueDonationIds = await DonationRequest.distinct("donationId", {
                ngoId: userId,
            });
            const totalDonationsInteracted = uniqueDonationIds.length;

            stats = {
                totalRequests,
                totalMealsReceived,
                completedRequests,
                pendingRequests,
                acceptedRequests,
                rejectedRequests,
                totalDonationsInteracted,
            };
        } else {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${userRole}' is not authorized to view reports.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Impact statistics retrieved successfully.",
            data: stats,
        });
    } catch (error) {
        console.error("Error in getImpactStatistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve impact statistics.",
        });
    }
};