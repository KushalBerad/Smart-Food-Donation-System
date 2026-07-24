import mongoose from "mongoose";

const donationHistorySchema = new mongoose.Schema(
    {
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DonationRequest",
            required: [true, "Request ID is required"],
        },
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
        finalStatus: {
            type: String,
            enum: ["completed", "expired", "cancelled"],
            required: [true, "Final status is required"],
        },
        completedAt: {
            type: Date,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        feedback: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const DonationHistory = mongoose.model("DonationHistory", donationHistorySchema);

export default DonationHistory;