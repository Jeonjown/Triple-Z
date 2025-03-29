// src/hooks/useSocket.tsx
import { useEffect } from "react";
import { socket } from "@/socket"; // adjust the import path as needed
import { Socket } from "socket.io-client";

export const useSocket = (roomId: string): Socket => {
  useEffect(() => {
    // Join the room when the component mounts
    socket.emit("join-room", roomId);

    // Clean up: leave the room when the component unmounts
    return () => {
      socket.emit("leave-room", roomId);
      // Note: Do not disconnect the socket here if it's shared across your app.
    };
  }, [roomId]);

  return socket;
};
