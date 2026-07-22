import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

dotenv.config();
connectDB();

const app = express();

//Middleware 
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donations", donationRoutes);
    
//Test Route
app.get("/", (req, res) => {
    res.json({ 
        message: "Smart Food Donation System"
    });
});  

//Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});