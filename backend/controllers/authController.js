import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

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
            address,
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
            address,
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
                address: user.address,
                organizationName: user.organizationName,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
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
                address: user.address,
                organizationName: user.organizationName,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
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
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
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
            address,
            organizationName,
            password,
        } = req.body || {};

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.city = city || user.city;
        user.address = address || user.address;
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
                address: updatedUser.address,
                organizationName: updatedUser.organizationName,
                isVerified: updatedUser.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
        });
    }
};

export const forgotPassword = async (req, res) => {
    console.time("Forgot Password");
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email.",
            });
        }
        console.time("Generate Token");
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        // generate token
        console.timeEnd("Generate Token");

        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;


        console.time("Save User");
        await user.save({ validateBeforeSave: false });
        // await user.save();
        console.timeEnd("Save User");

        const resetUrl =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const html = `
            <h2>FoodRescue Password Reset</h2>

            <p>Hello ${user.name},</p>

            <p>Click the link below to reset your password.</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>

            <p>If you didn't request this, please ignore this email.</p>
        `;
        console.time("Send Email");
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html,
        });
        // await sendEmail(...)
        console.timeEnd("Send Email");

        console.timeEnd("Forgot Password");
        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully.",
        });



    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token.",
            });
        }

        user.password = password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error",
        });
    }
};