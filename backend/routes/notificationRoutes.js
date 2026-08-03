import express from "express";

import {
    deleteNotification,
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../controllers/notificationController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Notification Routes
 */

router.get(
    "/",
    protect,
    getNotifications
);

router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);

router.patch(
    "/:id/read",
    protect,
    markNotificationAsRead
);

router.delete(
    "/:id",
    protect,
    deleteNotification
);

export default router;