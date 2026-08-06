import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/ngo", ngoRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/requirements", requirementRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/donor", donorRoutes);
app.use("/api/v1/support",supportRoutes);
app.use("/api/v1/notifications",notificationRoutes);
    
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