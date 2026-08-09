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
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const ngoId = req.user.id;

        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const filter = { ngoId };

        const { status } = req.query;

        if (status) {
            filter.status = status;
        }

        const [totalCount, requests] = await Promise.all([
            DonationRequest.countDocuments(filter),

            DonationRequest.find(filter)
                .populate({
                    path: "donationId",
                    select:
                        "foodName category quantity remainingQuantity preparedAt expiryAt pickupAddress pickupTime status",
                })
                .populate({
                    path: "donorId",
                    select: "name organizationName phone city",
                })
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        const formattedRequests = requests.map((request) => ({
            _id: request._id,

            requestedQuantity: request.requestedQuantity,
            fulfilledQuantity:
                request.fulfilledQuantity > 0
                    ? request.fulfilledQuantity
                    : null,

            status: request.status,
            pickupConfirmed: request.pickupConfirmed || false,

            requestedAt: request.requestedAt,
            respondedAt: request.respondedAt || null,

            donation: {
                _id: request.donationId?._id || null,
                foodName: request.donationId?.foodName || "Unknown",
                category: request.donationId?.category || "other",
                quantity: request.donationId?.quantity || "0",
                remainingQuantity:
                    request.donationId?.remainingQuantity ?? 0,
                preparedAt: request.donationId?.preparedAt || null,
                expiryAt: request.donationId?.expiryAt || null,
                pickupAddress:
                    request.donationId?.pickupAddress || "Unknown",
                pickupTime: request.donationId?.pickupTime || null,
                status: request.donationId?.status || "unknown",
            },

            donor: {
                _id: request.donorId?._id || null,
                organizationName:
                    request.donorId?.organizationName ||
                    request.donorId?.name ||
                    "Unknown",
                phone: request.donorId?.phone || "Unknown",
                city: request.donorId?.city || "Unknown",
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
        const ngoId = req.user.id;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        const [
            totalRequests,
            pendingRequests,
            acceptedRequests,
            completedPickups,
            availableDonations,
            recentRequests,
            acceptedPickupRequests,
            recentDonations,
        ] = await Promise.all([
            DonationRequest.countDocuments({
                ngoId,
            }),

            DonationRequest.countDocuments({
                ngoId,
                status: "pending",
            }),

            DonationRequest.countDocuments({
                ngoId,
                status: "accepted",
            }),

            DonationRequest.countDocuments({
                ngoId,
                status: "completed",
            }),

            FoodDonation.countDocuments({
                status: {
                    $in: ["available", "requested", "accepted"],
                },
                remainingQuantity: {
                    $gt: 0,
                },
            }),

            DonationRequest.find({
                ngoId,
            })
                .populate({
                    path: "donationId",
                    select:
                        "foodName category quantity remainingQuantity preparedAt expiryAt pickupAddress pickupTime status",
                })
                .populate({
                    path: "donorId",
                    select: "name organizationName phone city",
                })
                .sort({
                    requestedAt: -1,
                })
                .limit(5)
                .lean(),

            DonationRequest.find({
                ngoId,
                status: "accepted",
                pickupConfirmed: false,
            })
                .populate({
                    path: "donationId",
                    select: "foodName pickupTime pickupAddress",
                })
                .lean(),

            FoodDonation.find({
                status: {
                    $in: ["available", "requested", "accepted"],
                },
                remainingQuantity: {
                    $gt: 0,
                },
            })
                .populate({
                    path: "donorId",
                    select: "name organizationName phone city",
                })
                .sort({
                    createdAt: -1,
                })
                .limit(5)
                .lean(),
        ]);

        const acceptedPickups = acceptedPickupRequests.length;

        const todayPickups = acceptedPickupRequests.filter((request) => {
            const pickupTime = request.donationId?.pickupTime;

            if (!pickupTime) {
                return false;
            }

            const pickupDate = new Date(pickupTime);

            return (
                pickupDate >= startOfToday &&
                pickupDate < endOfToday
            );
        }).length;

        const formattedRecentDonations = recentDonations.map((donation) => ({
            _id: donation._id,
            foodName: donation.foodName,
            category: donation.category,
            quantity: donation.quantity,
            remainingQuantity: donation.remainingQuantity ?? 0,
            preparedAt: donation.preparedAt,
            expiryAt: donation.expiryAt,
            pickupAddress: donation.pickupAddress,
            pickupTime: donation.pickupTime,
            status: donation.status,
            donor: {
                _id: donation.donorId?._id || null,
                organizationName:
                    donation.donorId?.organizationName ||
                    donation.donorId?.name ||
                    "Unknown",
                city: donation.donorId?.city || "Unknown",
                phone: donation.donorId?.phone || "Unknown",
            },
        }));

        const formattedRecentRequests = recentRequests.map((request) => ({
            _id: request._id,
            requestedQuantity: request.requestedQuantity,
            fulfilledQuantity:
                request.fulfilledQuantity > 0
                    ? request.fulfilledQuantity
                    : null,
            status: request.status,
            pickupConfirmed: request.pickupConfirmed || false,
            requestedAt: request.requestedAt,
            respondedAt: request.respondedAt || null,

            donation: {
                _id: request.donationId?._id || null,
                foodName: request.donationId?.foodName || "Unknown",
                category: request.donationId?.category || "other",
                quantity: request.donationId?.quantity || "0",
                remainingQuantity:
                    request.donationId?.remainingQuantity ?? 0,
                preparedAt: request.donationId?.preparedAt || null,
                expiryAt: request.donationId?.expiryAt || null,
                pickupAddress:
                    request.donationId?.pickupAddress || "Unknown",
                pickupTime: request.donationId?.pickupTime || null,
                status: request.donationId?.status || "unknown",
            },

            donor: {
                _id: request.donorId?._id || null,
                organizationName:
                    request.donorId?.organizationName ||
                    request.donorId?.name ||
                    "Unknown",
                phone: request.donorId?.phone || "Unknown",
                city: request.donorId?.city || "Unknown",
            },
        }));

        return res.status(200).json({
            success: true,
            stats: {
                totalRequests,
                pendingRequests,
                acceptedRequests,
                acceptedPickups,
                completedPickups,
                todayPickups,
                availableDonations,
            },
            recentDonations: formattedRecentDonations,
            recentRequests: formattedRecentRequests,
        });
    } catch (error) {
        console.error("Error in getNGODashboardStats:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to retrieve dashboard data.",
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

        // Validate requested quantity
        if (
            requestedQuantity === undefined ||
            requestedQuantity === null ||
            String(requestedQuantity).trim() === ""
        ) {
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

        const availableQuantity =
            donation.remainingQuantity ??
            (parseInt(donation.quantity, 10) || 0);

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

            // Convert number to string because the schema expects String
            requestedQuantity: String(requestedQuantityInt),

            message:
                typeof message === "string"
                    ? message.trim()
                    : "",

            status: "pending",
        });

        // Update donation status to 'requested'
        if (donation.status === "available") {
            await FoodDonation.findByIdAndUpdate(
                donationId,
                {
                    status: "requested",
                },
                {
                    new: true,
                }
            );
        }

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
