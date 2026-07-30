import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * @desc    Fetch user settings & preferences
 * @route   GET /api/v1/settings
 * @access  Private (Donor & NGO)
 */
export const getUserSettings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const userId = req.user.id;

        // Fetch user with settings fields, excluding password
        const user = await User.findById(userId)
            .select("notificationPreference emailPreference theme language updatedAt")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Provide defaults for users whose documents don't yet have preference fields
        const settings = {
            notificationPreference: user.notificationPreference !== undefined ? user.notificationPreference : true,
            emailPreference: user.emailPreference !== undefined ? user.emailPreference : true,
            theme: user.theme !== undefined ? user.theme : "light",
            language: user.language !== undefined ? user.language : "English",
        };

        return res.status(200).json({
            success: true,
            message: "User settings retrieved successfully.",
            data: {
                userSettings: settings,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error in getUserSettings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user settings.",
        });
    }
};

/**
 * @desc    Update user settings & preferences
 * @route   PUT /api/v1/settings
 * @access  Private (Donor & NGO)
 */
export const updateUserSettings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User context is missing.",
            });
        }

        const userId = req.user.id;
        const { notificationPreference, emailPreference, theme, language, password } = req.body;

        // Fetch user with password field (select:false hides it by default)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Update preference fields if provided
        if (notificationPreference !== undefined) {
            if (typeof notificationPreference !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "notificationPreference must be a boolean.",
                });
            }
            user.notificationPreference = notificationPreference;
        }

        if (emailPreference !== undefined) {
            if (typeof emailPreference !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "emailPreference must be a boolean.",
                });
            }
            user.emailPreference = emailPreference;
        }

        if (theme !== undefined) {
            const validThemes = ["light", "dark"];
            if (!validThemes.includes(theme)) {
                return res.status(400).json({
                    success: false,
                    message: `theme must be one of: ${validThemes.join(", ")}.`,
                });
            }
            user.theme = theme;
        }

        if (language !== undefined) {
            const validLanguages = ["English", "Spanish", "French", "Hindi", "Other"];
            if (!validLanguages.includes(language)) {
                return res.status(400).json({
                    success: false,
                    message: `language must be one of: ${validLanguages.join(", ")}.`,
                });
            }
            user.language = language;
        }

        // If password is provided, hash it via the pre-save hook
        if (password !== undefined) {
            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long.",
                });
            }
            user.password = password;
        }

        // Save to trigger pre-save hook (password hashing) and update timestamps
        await user.save();

        // Return updated settings (never expose password)
        return res.status(200).json({
            success: true,
            message: "Settings updated successfully.",
            data: {
                userSettings: {
                    notificationPreference: user.notificationPreference,
                    emailPreference: user.emailPreference,
                    theme: user.theme,
                    language: user.language,
                },
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error in updateUserSettings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user settings.",
        });
    }
};