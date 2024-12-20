import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const server = express();
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://triple-ps2oxjnl2-jeonjowns-projects.vercel.app",
    ],
  })
);
server.use(userRoutes);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
