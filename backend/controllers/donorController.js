import DonorProfile from "../models/DonorProfile.js";
import User from "../models/User.js";

/**
 * @desc    Get authenticated donor profile
 * @route   GET /api/v1/donor/profile
 * @access  Private (Donor only)
 */
export const getDonorProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [user, donorProfile] = await Promise.all([
            User.findById(userId).select("-password").lean(),
            DonorProfile.findOne({ userId }).lean(),
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const profileData = {
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            city: user.city || donorProfile?.city || "",
            address: donorProfile?.address || "",
            totalDonations: donorProfile?.totalDonations || 0,
            totalQuantityDonated:
                donorProfile?.totalQuantityDonated || 0,
        };

        return res.status(200).json({
            success: true,
            message: "Donor profile fetched successfully",
            data: profileData,
        });

    } catch (error) {

        console.error("Error in getDonorProfile:", error);

        return res.status(500).json({
            success: false,
            message:
                "Internal server error. Failed to fetch donor profile.",
        });

    }
};

/**
 * @desc    Update authenticated donor profile
 * @route   PUT /api/v1/donor/profile
 * @access  Private (Donor only)
 */
export const updateDonorProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            name,
            phone,
            city,
            address,
        } = req.body;

        const userUpdate = {};

        if (name !== undefined) userUpdate.name = name;
        if (phone !== undefined) userUpdate.phone = phone;
        if (city !== undefined) userUpdate.city = city;

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(
                userId,
                userUpdate,
                {
                    runValidators: true,
                }
            );
        }

        if (address !== undefined) {
            await DonorProfile.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        address,
                        userId,
                    },
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                }
            );
        }

        const [updatedUser, updatedProfile] =
            await Promise.all([
                User.findById(userId)
                    .select("-password")
                    .lean(),
                DonorProfile.findOne({ userId }).lean(),
            ]);

        return res.status(200).json({
            success: true,
            message: "Donor profile updated successfully",
            data: {
                name: updatedUser.name,
                phone: updatedUser.phone,
                email: updatedUser.email,
                city:
                    updatedUser.city ||
                    updatedProfile?.city ||
                    "",
                address:
                    updatedProfile?.address || "",
                totalDonations:
                    updatedProfile?.totalDonations || 0,
                totalQuantityDonated:
                    updatedProfile?.totalQuantityDonated || 0,
            },
        });

    } catch (error) {

        console.error(
            "Error in updateDonorProfile:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error. Failed to update donor profile.",
        });

    }
};