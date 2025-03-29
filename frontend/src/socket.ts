import { io } from "socket.io-client";

const endpoint = import.meta.env.VITE_SOCKET_URL || "wss://localhost:3000";

export const socket = io(endpoint, {
  path: "/socket",
  withCredentials: true,
  transports: ["websocket"],
});

console.log(endpoint);
