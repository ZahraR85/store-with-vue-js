import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productRoutes from "./Routes/productRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import favoriteRoutes from "./Routes/favoriteRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/clothes-store")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Database error:", err);
  });

// routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/favorites", favoriteRoutes);
// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});