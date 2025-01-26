import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import menuItemRoutes from "./routes/menuItemRoutes";
import subcategoryRoutes from "./routes/subcategoryRoutes";

dotenv.config();

const server = express();

// Middleware setup
server.use(passport.initialize());
server.use(cookieParser());
server.use(express.json());
server.use(
  cors({
    origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
    credentials: true,
  })
);

// Route handling
server.use("/api/auth", authRoutes);
server.use("/api/users", userRoutes);
server.use("/api/menu", menuRoutes);
server.use("/api/menu/menu-items", menuItemRoutes);
server.use("/api/menu/category", categoryRoutes);
server.use("/api/menu/category", subcategoryRoutes);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
