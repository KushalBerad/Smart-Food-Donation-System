import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema(
    {
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodDonation",
            required: [true, "Donation ID is required"],
        },
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Donor ID is required"],
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "NGO ID is required"],
        },
        requestedQuantity: {
            type: String,
            required: [true, "Requested quantity is required"],
            trim: true,
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
            default: "pending",
        },
        requestedAt: {
            type: Date,
            default: Date.now,
        },
        respondedAt: {
            type: Date,
        },
        pickupConfirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);

export default DonationRequest;