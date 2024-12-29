import express from "express";
import cors from "cors";
import userRoutes from "./routes/authRoutes";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(express.json());
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://triple-z.vercel.app",
      "https://triple-5e2z5dqbv-jeonjowns-projects.vercel.app",
    ],
  })
);

server.use("/api/user", userRoutes);

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
