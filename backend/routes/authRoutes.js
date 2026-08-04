import express from "express";
import {
    forgotPassword,
    getUserProfile,
    loginUser,
    registerUser,
    resetPassword,
    updateUserProfile
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;