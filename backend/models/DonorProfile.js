import mongoose from "mongoose";

const donorProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        organizationName: {
            type: String,
            trim: true,
            default: "",
        },
        registrationNumber: {
            type: String,
            trim: true,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        totalDonations: {
            type: Number,
            default: 0,
        },
        totalQuantityDonated: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

export default DonorProfile;