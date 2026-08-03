import express from "express";

import {
    createSupportTicket,
    getMySupportTickets,
} from "../controllers/supportController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Support Routes
 */

router.post(
    "/",
    protect,
    createSupportTicket
);

router.get(
    "/",
    protect,
    getMySupportTickets
);

export default router;