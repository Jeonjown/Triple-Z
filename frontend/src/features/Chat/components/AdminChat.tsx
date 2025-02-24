import React, { useState, useEffect, ChangeEvent } from "react";
import { io } from "socket.io-client";
import RoomList, { Room } from "./RoomList";
import ChatWindow from "./ChatWindow";
import { useRoomsWithLatestMessage } from "../hooks/useRoomsWithLatestMessage";
import { useMessagesForRoom } from "../hooks/useMessagesForRoom";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

interface Message {
  _id: string;
  text: string;
  sender: "user" | "admin";
  roomId: string;
  createdAt?: string;
}

const AdminChat: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  // Get available rooms with their latest messages
  const { data: rooms } = useRoomsWithLatestMessage();

  // Fetch historical messages for the current room
  const {
    data: fetchedMessages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useMessagesForRoom(roomId);

  // Update messages when historical data is fetched,
  // ensuring each message has a defined _id.
  useEffect(() => {
    if (joined && fetchedMessages) {
      const transformedMessages: Message[] = fetchedMessages.map((msg) => ({
        ...msg,
        _id: msg._id ?? "", // Default to empty string if _id is undefined
      }));
      setMessages(transformedMessages);
    }
  }, [fetchedMessages, joined]);

  // Listen for real-time incoming messages via Socket.IO
  useEffect(() => {
    socket.on("receive-message", (data: Message) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  // Handle joining a room (manual input or from RoomList)
  const joinRoom = (selectedRoomId?: string) => {
    const newRoomId = selectedRoomId || roomId;
    if (newRoomId.trim() === "") return;
    socket.emit("join-room", newRoomId);
    setRoomId(newRoomId);
    setJoined(true);
    setMessages([]); // Clear previous messages when joining a new room
  };

  // Handle sending an admin message using _id instead of id
  const sendAdminMessage = () => {
    if (input.trim() === "" || !joined) return;

    const adminMessage: Message = {
      _id: "admin", // Replace with a unique admin identifier if available
      text: input,
      sender: "admin",
      roomId,
      createdAt: new Date().toISOString(),
    };

    socket.emit("admin-message", adminMessage);
    setMessages((prev) => [...prev, adminMessage]); // Optimistically update the chat
    setInput("");
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-xl font-bold">Admin Chat</h1>

      {/* Show available rooms if not yet joined */}
      {!joined && rooms && rooms.length > 0 && (
        <RoomList rooms={rooms as Room[]} onJoinRoom={joinRoom} />
      )}

      {/* Manual join UI */}
      {!joined && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRoomId(e.target.value)
            }
            className="mr-2 border p-2"
          />
          <button
            onClick={() => joinRoom()}
            className="rounded bg-primary p-2 text-white"
          >
            Join Room
          </button>
        </div>
      )}

      {/* Chat interface */}
      {joined && (
        <ChatWindow
          roomId={roomId}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSendMessage={sendAdminMessage}
          messagesLoading={messagesLoading}
          messagesError={messagesError}
        />
      )}
    </div>
  );
};

export default AdminChat;
