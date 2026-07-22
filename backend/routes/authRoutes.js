import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes

router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

//Protected Routes

router
  .route("/profile")
  .get(protect, getUserProfile)      // Get user's profile
  .put(protect, updateUserProfile);  // Update user's profile

export default router;