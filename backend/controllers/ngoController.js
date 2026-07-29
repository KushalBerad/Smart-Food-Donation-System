import mongoose from "mongoose";
import User from "../models/User.js";
import NGOProfile from "../models/NGOProfile.js";
import FoodDonation from "../models/FoodDonation.js";
import DonationRequest from "../models/DonationRequest.js";

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

        // Base filter: only available donations (platform-wide, no donorId filter)
        const filter = { status: "available" };

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
            await NGOProfile.findOneAndUpdate(
                { userId },
                ngoUpdateFields,
                { upsert: true, runValidators: true, new: true }
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
