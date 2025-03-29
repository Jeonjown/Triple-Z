import { io } from "socket.io-client";

const endpoint =
  process.env.NODE_ENV === "production"
    ? "wss://api.triplez.shop"
    : "ws://localhost:3000";

export const socket = io(endpoint, {
  transports: ["websocket"],
  withCredentials: true,
});
