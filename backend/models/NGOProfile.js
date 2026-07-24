import mongoose from "mongoose";

const ngoProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        ngoName: {
            type: String,
            required: [true, "NGO name is required"],
            trim: true,
        },
        registrationNumber: {
            type: String,
            required: [true, "Registration number is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        totalReceived: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const NGOProfile = mongoose.model("NGOProfile", ngoProfileSchema);

export default NGOProfile;