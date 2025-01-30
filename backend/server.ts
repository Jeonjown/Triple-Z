import express, { NextFunction, Response, Request } from "express";
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
import imageMenuRoutes from "./routes/imageMenuRoutes";
import { ResponseError } from "./utils/createError";

dotenv.config();

const server = express();

// Middleware setup
server.use(passport.initialize());
server.use(express.urlencoded({ extended: true }));
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
server.use("/api/menu/categories", categoryRoutes);
server.use("/api/menu/categories", subcategoryRoutes);
server.use("/api/menu/image", imageMenuRoutes);

server.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
