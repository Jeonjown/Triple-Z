import { io } from "socket.io-client";

const endpoint = import.meta.env.VITE_SOCKET_URL || "ws://localhost:3000";

export const socket = io(endpoint, {
  withCredentials: true,
  transports: ["websocket"], // explicitly use websocket transport
  secure: endpoint.startsWith("wss"), // set secure flag if using wss
});
