import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role,
            city,
            organizationName,
            registrationNumber,
            verificationDocument,
        } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            city,
            organizationName,
            registrationNumber,
            verificationDocument,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token: generateToken(user._id),
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                city: user.city,
                organizationName: user.organizationName,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Password is select:false in schema
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: generateToken(user._id),
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                city: user.city,
                organizationName: user.organizationName,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the token before storing
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Save hashed token and expiry (15 minutes)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Development response
        // Later we will email this token instead.
        return res.status(200).json({
            success: true,
            message: "Password reset token generated successfully.",
            resetToken,
            expiresIn: "15 minutes",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validate password
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        // Hash the received token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find matching user whose token hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Assign plain password.
        // The pre("save") middleware will hash it automatically.
        user.password = password;

        // Remove reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Update logged-in user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;

        const {
            name,
            phone,
            city,
            organizationName,
            password,
        } = req.body || {};

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.city = city || user.city;
        user.organizationName = organizationName || user.organizationName;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                city: updatedUser.city,
                organizationName: updatedUser.organizationName,
                isVerified: updatedUser.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};