import Notification from "../models/Notification.js";

/**
 * @desc    Get Logged-in User Notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user.id,
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
        });
    }
};

/**
 * @desc    Mark Notification as Read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }
        await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
            {
                isRead: true,
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
        });
    } catch (error) {
        console.error("Mark Notification Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification.",
        });
    }
};

/**
 * @desc    Mark All Notifications as Read
 * @route   PATCH /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    } catch (error) {
        console.error("Read All Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications.",
        });
    }
};

/**
 * @desc    Delete Notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Notification Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete notification.",
        });
    }
};