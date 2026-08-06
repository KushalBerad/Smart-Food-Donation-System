import mongoose from "mongoose";

const donationOfferSchema = new mongoose.Schema(
    {
        requirementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NGORequirement",
            required: [true, "Requirement ID is required"],
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "NGO ID is required"],
        },
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Donor ID is required"],
        },
        offeredQuantity: {
            type: Number,
            required: [true, "Offered quantity is required"],
            min: [1, "Offered quantity must be at least 1"],
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
        offeredAt: {
            type: Date,
            default: Date.now,
        },
        respondedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const DonationOffer = mongoose.model("DonationOffer", donationOfferSchema);

export default DonationOffer;