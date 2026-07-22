import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donations", donationRoutes);
    
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Smart Food Donation System API is running...",
    });
});

// Handle Unknown Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});