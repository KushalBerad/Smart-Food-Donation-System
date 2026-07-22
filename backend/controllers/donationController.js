import mongoose from "mongoose";
import FoodDonation from "../models/FoodDonation.js";
import User from "../models/User.js";

/**
 * @desc    Create a new food donation
 * @route   POST /api/donations/create
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

        const donation = await FoodDonation.create({
            donorId,
            foodName,
            category,
            quantity,
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
 * @route   GET /api/donations/:id
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
 * @route   GET /api/donations/my-donations
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
