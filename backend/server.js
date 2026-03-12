// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./Routes/productRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import favoriteRoutes from "./Routes/favoriteRoutes.js";

dotenv.config(); // load .env

const app = express();

// Use port from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5174", // URL of your Vue frontend
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Store")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Database error:", err));

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/favorites", favoriteRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});