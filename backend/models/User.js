import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: "Please enter a valid email address",
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[6-9]\d{9}$/.test(value);
                },
                message: "Please enter a valid 10-digit Indian mobile number",
            },
        },

        role: {
            type: String,
            enum: ["donor", "ngo"],
            required: true,
        },

        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
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

        verificationDocument: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;