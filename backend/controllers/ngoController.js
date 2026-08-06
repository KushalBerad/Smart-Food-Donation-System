import mongoose from "mongoose";
import DonationHistory from "../models/DonationHistory.js";
import DonationRequest from "../models/DonationRequest.js";
import FoodDonation from "../models/FoodDonation.js";
import NGOProfile from "../models/NGOProfile.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * @desc    Browse all available food donations across the platform (NGO view)
 * @route   GET /api/v1/ngo/donations
 * @access  Private (NGO only)
 */
export const getAvailableDonations = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        // Parse and validate pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        // Base filter: only open donations with remaining quantity (platform-wide, no donorId filter)
        const filter = {
            status: { $in: ["available", "requested", "accepted"] },
            remainingQuantity: { $gt: 0 },
        };

        // Category filter
        const { category } = req.query;
        if (category && category !== "all") {
            filter.category = category;
        }

        // Search filter: match foodName or pickupAddress
        const { search } = req.query;
        if (search && search.trim()) {
            filter.$or = [
                { foodName: { $regex: search.trim(), $options: "i" } },
                { pickupAddress: { $regex: search.trim(), $options: "i" } },
            ];
        }

        // Determine sort order
        const { sortBy = "newest" } = req.query;
        let sortOption = { createdAt: -1 }; // default: newest first

        if (sortBy === "expirySoonest") {
            sortOption = { expiryAt: 1 };
        } else if (sortBy === "newest") {
            sortOption = { createdAt: -1 };
        }

        // Run count and query in parallel
        const [totalCount, donations] = await Promise.all([
            FoodDonation.countDocuments(filter),
            FoodDonation.find(filter)
                .populate({
                    path: "donorId",
                    select: "organizationName city name phone",
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        // Map donations to the required response shape
        const formattedDonations = donations.map((donation) => ({
            _id: donation._id,
            foodName: donation.foodName,
            category: donation.category,
            quantity: donation.quantity,
            remainingQuantity: donation.remainingQuantity ?? 0,
            preparedAt: donation.preparedAt,
            expiryAt: donation.expiryAt,
            pickupAddress: donation.pickupAddress,
            status: donation.status,
            donor: {
                _id: donation.donorId?._id || null,
                organizationName: donation.donorId?.organizationName || donation.donorId?.name || "Unknown",
                city: donation.donorId?.city || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            donations: formattedDonations,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error in getAvailableDonations:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve donations.",
        });
    }
};

/**
 * @desc    Fetch all donation requests made by the authenticated NGO
 * @route   GET /api/v1/requests/my
 * @access  Private (NGO only)
 */
export const getMyRequests = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const ngoId = req.user.id;

        // Parse and validate pagination query parameters
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        // Build filter: only requests belonging to this NGO
        const filter = { ngoId };

        // Optional status filter
        const { status } = req.query;
        if (status) {
            filter.status = status;
        }

        // Run count and query in parallel
        const [totalCount, requests] = await Promise.all([
            DonationRequest.countDocuments(filter),
            DonationRequest.find(filter)
                .populate({
                    path: "donationId",
                    select: "foodName quantity preparedAt expiryAt pickupAddress",
                })
                .populate({
                    path: "donorId",
                    select: "name organizationName phone",
                })
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        // Map to the required response shape
        const formattedRequests = requests.map((req) => ({
            _id: req._id,
            requestedQuantity: req.requestedQuantity,
            status: req.status,
            requestedAt: req.requestedAt,
            donation: {
                _id: req.donationId?._id || null,
                foodName: req.donationId?.foodName || "Unknown",
                pickupAddress: req.donationId?.pickupAddress || "Unknown",
            },
            donor: {
                _id: req.donorId?._id || null,
                organizationName: req.donorId?.organizationName || req.donorId?.name || "Unknown",
                phone: req.donorId?.phone || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            requests: formattedRequests,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error in getMyRequests:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve requests.",
        });
    }
};

/**
 * @desc    Fetch authenticated NGO's profile (User + NGOProfile merged)
 * @route   GET /api/v1/ngo/profile
 * @access  Private (NGO only)
 */
export const getNGOProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch User and NGOProfile in parallel
        const [user, ngoProfile] = await Promise.all([
            User.findById(userId).select("-password").lean(),
            NGOProfile.findOne({ userId }).lean(),
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Merge data from User and NGOProfile models
        const profileData = {
            organizationName: ngoProfile?.ngoName || user.organizationName || "",
            registrationNumber: ngoProfile?.registrationNumber || user.registrationNumber || "",
            contactPerson: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            city: ngoProfile?.city || user.city || "",
            address: ngoProfile?.address || "",
            verificationStatus: ngoProfile?.verificationStatus || "pending",
            verificationDocument: user.verificationDocument || "",
            updatedAt: ngoProfile?.updatedAt || user.updatedAt,
        };

        return res.status(200).json({
            success: true,
            message: "NGO Profile fetched successfully",
            data: profileData,
        });
    } catch (error) {
        console.error("Error in getNGOProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to fetch NGO profile.",
        });
    }
};

/**
 * @desc    Update authenticated NGO's profile (User + NGOProfile merged)
 * @route   PUT /api/v1/ngo/profile
 * @access  Private (NGO only)
 */
export const updateNGOProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            organizationName,
            registrationNumber,
            contactPerson,
            phone,
            email,
            city,
            address,
            verificationDocument,
        } = req.body;

        // Update fields on User model
        const userUpdateFields = {};
        if (contactPerson !== undefined) userUpdateFields.name = contactPerson;
        if (phone !== undefined) userUpdateFields.phone = phone;
        if (email !== undefined) userUpdateFields.email = email;
        if (verificationDocument !== undefined) userUpdateFields.verificationDocument = verificationDocument;

        if (Object.keys(userUpdateFields).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdateFields, { runValidators: true });
        }

        // Update fields on NGOProfile model (upsert if doesn't exist)
        const ngoUpdateFields = {};
        if (organizationName !== undefined) ngoUpdateFields.ngoName = organizationName;
        if (registrationNumber !== undefined) ngoUpdateFields.registrationNumber = registrationNumber;
        if (city !== undefined) ngoUpdateFields.city = city;
        if (address !== undefined) ngoUpdateFields.address = address;

        if (Object.keys(ngoUpdateFields).length > 0) {

            ngoUpdateFields.userId = userId;

            await NGOProfile.findOneAndUpdate(
                { userId },
                { $set: ngoUpdateFields },
                {
                    upsert: true,
                    runValidators: true,
                    new: true,
                    setDefaultsOnInsert: true,
                }
            );
        }

        // Fetch updated data and return merged profile
        const [updatedUser, updatedNgoProfile] = await Promise.all([
            User.findById(userId).select("-password").lean(),
            NGOProfile.findOne({ userId }).lean(),
        ]);

        const profileData = {
            organizationName: updatedNgoProfile?.ngoName || updatedUser.organizationName || "",
            registrationNumber: updatedNgoProfile?.registrationNumber || updatedUser.registrationNumber || "",
            contactPerson: updatedUser.name || "",
            phone: updatedUser.phone || "",
            email: updatedUser.email || "",
            city: updatedNgoProfile?.city || updatedUser.city || "",
            address: updatedNgoProfile?.address || "",
            verificationStatus: updatedNgoProfile?.verificationStatus || "pending",
            verificationDocument: updatedUser.verificationDocument || "",
            updatedAt: updatedNgoProfile?.updatedAt || updatedUser.updatedAt,
        };

        return res.status(200).json({
            success: true,
            message: "NGO Profile updated successfully",
            data: profileData,
        });
    } catch (error) {
        console.error("Error in updateNGOProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to update NGO profile.",
        });
    }
};

/**
 * @desc    Get NGO dashboard statistics + recent data
 * @route   GET /api/v1/ngo/dashboard
 * @access  Private (NGO only)
 */
export const getNGODashboardStats = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const ngoId = req.user.id;

        // Run all stat queries + recent data in parallel
        const [
            availableDonationsCount,
            myRequestsCount,
            acceptedRequestsCount,
            completedPickupsCount,
            recentDonations,
            recentRequests,
            user,
        ] = await Promise.all([
            // Stat 1: Available donations platform-wide
            FoodDonation.countDocuments({ status: "available" }),

            // Stat 2: Total requests submitted by this NGO
            DonationRequest.countDocuments({ ngoId }),

            // Stat 3: Accepted requests for this NGO
            DonationRequest.countDocuments({ ngoId, status: "accepted" }),

            // Stat 4: Completed pickups for this NGO
            DonationRequest.countDocuments({ ngoId, pickupConfirmed: true }),

            // Recent available donations (top 4)
            FoodDonation.find({ status: "available" })
                .populate({
                    path: "donorId",
                    select: "organizationName name city",
                })
                .sort({ createdAt: -1 })
                .limit(4)
                .lean(),

            // Recent requests by this NGO (top 3)
            DonationRequest.find({ ngoId })
                .populate({
                    path: "donationId",
                    select: "foodName pickupAddress pickupTime",
                })
                .populate({
                    path: "donorId",
                    select: "organizationName name",
                })
                .sort({ requestedAt: -1 })
                .limit(3)
                .lean(),

            // User details for welcome message
            User.findById(ngoId).select("name organizationName registrationNumber").lean(),
        ]);

        // Format recent donations
        const formattedDonations = recentDonations.map((d) => ({
            _id: d._id,
            foodName: d.foodName,
            quantity: d.quantity,
            expiryAt: d.expiryAt,
            pickupAddress: d.pickupAddress,
            donor: {
                _id: d.donorId?._id || null,
                organizationName: d.donorId?.organizationName || d.donorId?.name || "Unknown",
                city: d.donorId?.city || "Unknown",
            },
        }));

        // Format recent requests
        const formattedRequests = recentRequests.map((r) => ({
            _id: r._id,
            status: r.status,
            requestedAt: r.requestedAt,
            pickupConfirmed: r.pickupConfirmed,
            respondedAt: r.respondedAt,
            donation: {
                _id: r.donationId?._id || null,
                foodName: r.donationId?.foodName || "Unknown",
                pickupTime: r.donationId?.pickupTime || null,
            },
            donor: {
                _id: r.donorId?._id || null,
                organizationName: r.donorId?.organizationName || r.donorId?.name || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            stats: {
                availableDonations: availableDonationsCount,
                myRequests: myRequestsCount,
                acceptedRequests: acceptedRequestsCount,
                completedPickups: completedPickupsCount,
            },
            recentDonations: formattedDonations,
            recentRequests: formattedRequests,
            ngo: {
                name: user?.organizationName || user?.name || "NGO",
                registrationNumber: user?.registrationNumber || "",
            },
        });
    } catch (error) {
        console.error("Error in getNGODashboardStats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve dashboard stats.",
        });
    }
};

/**
 * @desc    Create a donation request (NGO requests a food donation)
 * @route   POST /api/v1/ngo/request
 * @access  Private (NGO only)
 */
export const createDonationRequest = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const ngoId = req.user.id;
        const { donationId, requestedQuantity, message } = req.body;

        // Validate donationId
        if (!donationId || !mongoose.Types.ObjectId.isValid(donationId)) {
            return res.status(400).json({
                success: false,
                message: "Valid donation ID is required.",
            });
        }

        if (!requestedQuantity || !requestedQuantity.trim()) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity is required.",
            });
        }

        // Verify donation exists and is still open for claiming
        const donation = await FoodDonation.findById(donationId).lean();

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found.",
            });
        }

        if (!["available", "requested", "accepted"].includes(donation.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot request donation with status '${donation.status}'. The listing is no longer open.`,
            });
        }

        // Parse and validate requested quantity against the remaining available quantity
        const requestedQuantityInt = parseInt(requestedQuantity, 10);
        if (isNaN(requestedQuantityInt) || requestedQuantityInt <= 0) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity must be a positive number.",
            });
        }

        const availableQuantity = donation.remainingQuantity ?? (parseInt(donation.quantity, 10) || 0);
        if (requestedQuantityInt > availableQuantity) {
            return res.status(400).json({
                success: false,
                message: `Cannot request ${requestedQuantityInt} meal(s). Only ${availableQuantity} meal(s) remain available for this donation.`,
            });
        }

        // Check if NGO already has a pending request for this donation
        const existingRequest = await DonationRequest.findOne({
            donationId,
            ngoId,
            status: "pending",
        }).lean();

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending request for this donation.",
            });
        }

        // Create the donation request
        const donationRequest = await DonationRequest.create({
            donationId,
            donorId: donation.donorId,
            ngoId,
            requestedQuantity: requestedQuantity.trim(),
            message: message?.trim() || "",
            status: "pending",
        });

        // Update donation status to 'requested' (keeps it visible while remaining > 0)
        await FoodDonation.findByIdAndUpdate(donationId, {
            status: "requested",
        });

        // Notify the donor
        await Notification.create({
            userId: donation.donorId,
            type: "request",
            title: "New Donation Request",
            message: `An NGO has requested your donation "${donation.foodName}".`,
        });

        return res.status(201).json({
            success: true,
            message: "Donation request submitted successfully.",
            data: donationRequest,
        });
    } catch (error) {
        console.error("Error in createDonationRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to create donation request.",
        });
    }
};

/**
 * @desc    Get NGO history (completed/cancelled pickups)
 * @route   GET /api/v1/ngo/history
 * @access  Private (NGO only)
 */
export const getNGOHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const ngoId = req.user.id;

        // Parse pagination
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;
        const skip = (page - 1) * limit;

        // Filter for this NGO's history
        const filter = { ngoId };

        // Optional status filter
        const { status } = req.query;
        if (status) {
            filter.finalStatus = status;
        }

        const [totalCount, historyRecords] = await Promise.all([
            DonationHistory.countDocuments(filter),
            DonationHistory.find(filter)
                .populate({
                    path: "donationId",
                    select: "foodName category quantity pickupAddress pickupTime expiryAt",
                })
                .populate({
                    path: "donorId",
                    select: "name organizationName city phone",
                })
                .populate({
                    path: "requestId",
                    select: "requestedQuantity message status requestedAt respondedAt",
                })
                .sort({ completedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        const formattedHistory = historyRecords.map((record) => ({
            _id: record._id,
            foodName: record.donationId?.foodName || "Unknown Food",
            donorName: record.donorId?.organizationName || record.donorId?.name || "Unknown",
            donorCity: record.donorId?.city || "Unknown",
            finalStatus: record.finalStatus,
            completedAt: record.completedAt,
            quantity: record.donationId?.quantity || "Unknown",
            rating: record.rating,
            feedback: record.feedback,
        }));

        return res.status(200).json({
            success: true,
            history: formattedHistory,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error in getNGOHistory:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve NGO history.",
        });
    }
};
