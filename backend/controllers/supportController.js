import SupportTicket from "../models/SupportTicket.js";

/**
 * @desc    Create Support Ticket
 * @route   POST /api/v1/support
 * @access  Private
 */
export const createSupportTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Subject and message are required.",
            });
        }

        const ticket = await SupportTicket.create({
            user: req.user.id,
            subject: subject.trim(),
            message: message.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Support ticket submitted successfully.",
            data: ticket,
        });
    } catch (error) {
        console.error("Create Support Ticket Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit support ticket.",
        });
    }
};

/**
 * @desc    Get Logged-in User Support Tickets
 * @route   GET /api/v1/support
 * @access  Private
 */
export const getMySupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({
            user: req.user.id,
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error("Get Support Tickets Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch support tickets.",
        });
    }
};