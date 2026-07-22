import mongoose from "mongoose";

const foodDonationSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Donor ID is required"],
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
        quantity: {
            type: String,
            required: [true, "Quantity is required"],
            trim: true,
        },
        preparedAt: {
            type: Date,
            required: [true, "Preparation time is required"],
        },
        expiryAt: {
            type: Date,
            required: [true, "Expiry time is required"],
        },
        pickupAddress: {
            type: String,
            required: [true, "Pickup address is required"],
            trim: true,
        },
        pickupTime: {
            type: Date,
            required: [true, "Pickup time is required"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: {
                values: ["available", "requested", "accepted", "completed", "expired", "cancelled"],
                message: "Invalid status",
            },
            default: "available",
        },
    },
    {
        timestamps: true,
    }
);

const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema);

export default FoodDonation;