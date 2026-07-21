import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @desc    Protect routes - verifies JWT token and attaches user to req.user
 * @access  Private (any authenticated user)
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user without password
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }

            return next();
        }

        return res.status(401).json({
            success: false,
            message: "Not authorized. Token is missing.",
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

/**
 * @desc    Authorize by role(s) - restricts access to specific user roles
 * @param   {...string} roles - One or more allowed roles (e.g., "donor", "ngo")
 * @usage   router.get("/some-route", protect, authorize("donor"), handler);
 *          router.get("/some-route", protect, authorize("donor", "ngo"), handler);
 * @access  Private (must be used AFTER protect middleware)
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        // Ensure protect middleware ran first and attached req.user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please authenticate first.",
            });
        }

        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user.role}' is not authorized to access this resource. Allowed roles: ${roles.join(", ")}`,
            });
        }

        return next();
    };
};