import mongoose from "mongoose";

const ngoRequirementSchema = new mongoose.Schema(
    {
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "NGO ID is required"],
        },
        foodName: {
            type: String,
            required: [true, "Food name is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["veg", "non-veg", "other"],
                message: "Category must be either 'veg', 'non-veg', or 'other'",
            },
        },
        requiredQuantity: {
            type: Number,
            required: [true, "Required quantity is required"],
            min: [1, "Required quantity must be at least 1"],
        },
        fulfilledQuantity: {
            type: Number,
            default: 0,
            min: [0, "Fulfilled quantity cannot be negative"],
        },
        remainingQuantity: {
            type: Number,
            default: 0,
            min: [0, "Remaining quantity cannot be negative"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: {
                values: ["open", "completed", "cancelled"],
                message: "Invalid status",
            },
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

const NGORequirement = mongoose.model("NGORequirement", ngoRequirementSchema);

export default NGORequirement;