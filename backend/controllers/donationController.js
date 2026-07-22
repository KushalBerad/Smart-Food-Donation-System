import FoodDonation from "../models/FoodDonation.js";
import User from "../models/User.js";

/**
 * @desc    Create a new food donation
 * @route   POST /api/donations
 * @access  Private (Donor only)
 */
export const createDonation = async (req, res) => {
    try {
        // 1. Extract authenticated donorId from req.user
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const donorId = req.user.id;

        // 2. Safety Check: Verify that the donorId actually exists in the database
        const donorExists = await User.findById(donorId);
        if (!donorExists) {
            return res.status(404).json({
                success: false,
                message: "Donor not found in the database",
            });
        }

        // 3. Extract validated and sanitized data from req.body
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

        // 4. Insert the document into the FoodDonations collection
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
            status: "available", // Default status
        });

        // 5. Return successful creation response
        return res.status(201).json({
            success: true,
            message: "Donation created successfully",
            data: donation,
        });
    } catch (error) {
        // 6. Catch any database connection or write errors and return 500
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to create donation.",
        });
    }
};