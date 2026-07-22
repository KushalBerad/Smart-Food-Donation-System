/**
 * Middleware to validate and sanitize the "Create Donation" request body.
 * Strips unknown fields to prevent over-posting/mass assignment attacks.
 * Enforces safety checks on dates.
 */
export const validateCreateDonation = (req, res, next) => {
    try {
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

        // 1. Check required fields
        if (!foodName || typeof foodName !== "string" || foodName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Food name is required and must be a non-empty string",
            });
        }

        if (!category || !["veg", "non-veg", "other"].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Category is required and must be 'veg', 'non-veg', or 'other'",
            });
        }

        if (!quantity || typeof quantity !== "string" || quantity.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Quantity is required and must be a non-empty string",
            });
        }

        if (!preparedAt) {
            return res.status(400).json({
                success: false,
                message: "Preparation time (preparedAt) is required",
            });
        }

        if (!pickupAddress || typeof pickupAddress !== "string" || pickupAddress.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Pickup address is required and must be a non-empty string",
            });
        }

        if (!pickupTime) {
            return res.status(400).json({
                success: false,
                message: "Pickup time (pickupTime) is required",
            });
        }

        // 2. Parse and validate dates
        const preparedDate = new Date(preparedAt);
        const pickupDate = new Date(pickupTime);

        if (isNaN(preparedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid preparation time format",
            });
        }

        if (isNaN(pickupDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup time format",
            });
        }

        // 3. Safety Check: Ensure preparedAt is not older than 48 hours
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        if (preparedDate < fortyEightHoursAgo) {
            return res.status(400).json({
                success: false,
                message: "Preparation time cannot be older than 48 hours",
            });
        }

        // 4. Safety Check: Ensure pickupTime is strictly greater than or equal to preparedAt
        if (pickupDate < preparedDate) {
            return res.status(400).json({
                success: false,
                message: "Pickup time must be greater than or equal to preparation time",
            });
        }

        // 5. Handle expiryAt (optional in UI, required in DB schema)
        let expiryDate;
        if (expiryAt) {
            expiryDate = new Date(expiryAt);
            if (isNaN(expiryDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expiry time format",
                });
            }
            if (expiryDate <= preparedDate) {
                return res.status(400).json({
                    success: false,
                    message: "Expiry time must be strictly greater than preparation time",
                });
            }
        } else {
            // Calculate dynamically: preparedAt + 24 hours
            expiryDate = new Date(preparedDate.getTime() + 24 * 60 * 60 * 1000);
        }

        // 6. Strip unknown fields by re-assigning req.body with only validated fields
        req.body = {
            foodName: foodName.trim(),
            category,
            quantity: quantity.trim(),
            preparedAt: preparedDate,
            expiryAt: expiryDate,
            pickupAddress: pickupAddress.trim(),
            pickupTime: pickupDate,
            description: typeof description === "string" ? description.trim() : "",
        };

        return next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid request data",
        });
    }
};