import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/authRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "./config/passport";

dotenv.config();

const server = express();
server.use(passport.initialize());
server.use(cookieParser());
server.use(express.json());
server.use(
  cors({
    origin: ["http://localhost:5173", "https://triple-z.vercel.app"],
    credentials: true,
  })
);

server.use("/api/auth", userRoutes);

type Error = {
  status?: number;
  message?: string;
};

server.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res
    .status(error.status || 500)
    .json({ message: error.message || "internal server error" });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log("mongoDB connected successfully");
  } catch (error) {
    return console.error(error);
  }
};
connectDB();
