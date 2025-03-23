// useSocket.ts
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
  `${import.meta.env.VITE_API_URL}` || "http://localhost:3000";

export const useSocket = (roomId: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });
    setSocket(socketInstance);

    socketInstance.emit("join-room", roomId);

    return () => {
      socketInstance.emit("leave-room", roomId);
      socketInstance.disconnect();
    };
  }, [roomId]);

  return socket;
};
