import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import RoomList, { Room } from "./RoomList";
import ChatWindow from "./ChatWindow";
import UserDetails from "./UserDetails";
import { useRoomsWithLatestMessage } from "../hooks/useRoomsWithLatestMessage";
import { useMessagesForRoom } from "../hooks/useMessagesForRoom";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useGetUser } from "@/features/Users/hooks/useGetUser";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

export interface Message {
  userId: string;
  _id: string;
  text: string;
  sender: "user" | "admin";
  roomId: string;
  createdAt?: string;
}

const AdminChat: React.FC = () => {
  const { user } = useAuthStore();
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  // State for the selected user ID (for fetching user details)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );

  // Fetch rooms with their latest messages
  const { data: rooms } = useRoomsWithLatestMessage();
  // Fetch historical messages for the current room
  const {
    data: fetchedMessages,
    isPending: messagesLoading,
    error: messagesError,
  } = useMessagesForRoom(roomId);
  // Fetch user details for the selected user
  const { data: userInfo, isPending, error } = useGetUser(selectedUserId);

  // Memoize joinRoom so that its reference remains stable
  const joinRoom = useCallback(
    (selectedRoomId?: string, roomUserId?: string) => {
      const newRoomId = selectedRoomId || roomId;
      if (newRoomId.trim() === "") return;
      socket.emit("join-room", newRoomId);
      setRoomId(newRoomId);
      setJoined(true);
      setMessages([]);
      // Set the selected user ID for fetching user details
      if (roomUserId) {
        setSelectedUserId(roomUserId);
      } else {
        setSelectedUserId(undefined);
      }
    },
    [roomId],
  );

  // Automatically select the top room if none is selected
  useEffect(() => {
    if (!roomId && rooms && rooms.length > 0) {
      const topRoom = rooms[0] as Room;
      joinRoom(topRoom.roomId, topRoom.latestMessage?.userId);
    }
  }, [rooms, roomId, joinRoom]);

  // Update messages when historical messages are fetched
  useEffect(() => {
    if (joined && fetchedMessages) {
      const transformedMessages: Message[] = fetchedMessages.map((msg) => ({
        ...msg,
        _id: msg._id ?? "",
        userId: msg.userId ?? "",
      }));
      setMessages(transformedMessages);
    }
  }, [fetchedMessages, joined]);

  // Listen for real-time messages
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

  // Send an admin message
  const sendAdminMessage = () => {
    if (input.trim() === "" || !joined) return;

    const adminMessage: Message = {
      _id: "admin", // Placeholder; ideally assigned by the backend.
      text: input,
      sender: "admin",
      roomId,
      userId: user?._id || "",
      createdAt: new Date().toISOString(),
    };

    socket.emit("admin-message", adminMessage);
    setInput("");
  };

  return (
    <div className="inset-0 grid h-screen grid-cols-12">
      {/* Left Sidebar: Room List */}
      <div className="col-span-3 border-r bg-white">
        {rooms && rooms.length > 0 && (
          <RoomList
            rooms={rooms as Room[]}
            activeRoomId={roomId}
            onJoinRoom={joinRoom}
          />
        )}
      </div>

      {/* Main Chat Window */}
      <div className="col-span-6 flex flex-col">
        <ChatWindow
          roomId={roomId}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSendMessage={sendAdminMessage}
          messagesLoading={messagesLoading}
          messagesError={messagesError}
        />
      </div>

      {/* Right Sidebar: User Details */}
      <div className="col-span-3 border-l bg-white">
        <UserDetails user={userInfo} isPending={isPending} error={error} />
      </div>
    </div>
  );
};

export default AdminChat;
