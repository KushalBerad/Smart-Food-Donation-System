import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["open", "resolved"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "SupportTicket",
    supportTicketSchema
);