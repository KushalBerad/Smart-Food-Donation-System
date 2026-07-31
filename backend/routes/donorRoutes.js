import express from "express";
import {
  getDonorProfile,
  updateDonorProfile
} from "../controllers/donorController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


router.get(
  "/profile",
  protect,
  getDonorProfile
);


router.put(
  "/profile",
  protect,
  updateDonorProfile
);


export default router;