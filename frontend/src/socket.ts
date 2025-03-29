import { io } from "socket.io-client";

const endpoint =
  import.meta.env.VITE_API_URL.replace(/^https:/, "wss:") ||
  "ws://localhost:3000";

export const socket = io(endpoint, {
  withCredentials: true,
});
