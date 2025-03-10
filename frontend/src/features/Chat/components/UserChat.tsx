import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { v4 as uuid } from "uuid"; // Import uuid for generating unique IDs
import { useSendNotificationToAdmin } from "@/features/Notifications/hooks/useSendNotificationToAdmins";
import { useMessagesForRoom } from "../hooks/useMessagesForRoom";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

interface Message {
  roomId: string;
  userId: string;
  text: string;
  sender: "user" | "admin";
  username?: string;
}

const UserChat: React.FC = () => {
  const { user } = useAuthStore();

  // Declare roomId state before using it in any hook.
  const [roomId, setRoomId] = useState<string>(() => {
    if (user?._id) {
      return `room_${user._id}`;
    }
    // For first-time or unauthenticated users, check localStorage for a stored room ID.
    let storedRoom = localStorage.getItem("chatRoomId");
    if (!storedRoom) {
      storedRoom = `room_${uuid()}`;
      localStorage.setItem("chatRoomId", storedRoom);
    }
    return storedRoom;
  });

  // Use the hook to fetch chat history
  const { data } = useMessagesForRoom(roomId);

  // Local states for managing chat
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const { mutate } = useSendNotificationToAdmin();

  // Update local messages state when chat history is loaded
  useEffect(() => {
    if (data && data.length > 0) {
      setMessages(data);
    }
  }, [data]);

  // Update roomId when user logs in or their info changes.
  useEffect(() => {
    if (user?._id) {
      const newRoom = `room_${user._id}`;
      if (newRoom !== roomId) {
        setRoomId(newRoom);
      }
    }
  }, [user?._id, roomId]);

  // Join the room and set up the message listener.
  useEffect(() => {
    const previousRoomId = roomId;
    socket.emit("join-room", roomId);

    const messageHandler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
      socket.emit("leave-room", previousRoomId);
    };
  }, [roomId]);

  // Send a message using the appropriate room ID.
  const sendMessage = (): void => {
    if (input.trim() === "") return;
    const newMessage: Message = {
      roomId,
      userId: user?._id || roomId,
      text: input,
      sender: user?.role === "admin" ? "admin" : "user",
    };
    console.log(newMessage);
    setInput("");
    socket.emit("send-message", newMessage);
    mutate({
      title: "New Message Received",
      description: `User ${user?._id || roomId} sent: "${newMessage.text}"`,
    });
  };

  if (user?.role === "admin") return null;
  return (
    <div className="fixed bottom-10 right-10 z-20">
      {open ? (
        <div className="flex h-96 w-80 flex-col rounded-lg border bg-white shadow-lg">
          {/* Chat Header */}
          <div className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-2 text-white">
            <span>Support Chat</span>
            <button onClick={() => setOpen(false)} className="text-xl">
              &times;
            </button>
          </div>
          {/* Messages Area */}
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded p-2 ${
                  msg.sender === "user"
                    ? "self-end bg-primary text-white"
                    : "self-start bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm font-bold">
                  {msg.sender === "user" ? "You" : "Triple-Z"}
                </p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          {/* Input Area */}
          <div className="flex items-center border-t px-4 py-2">
            <input
              type="text"
              className="flex-1 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your message..."
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              className="ml-2 rounded bg-primary px-3 py-2 text-white"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        // Chat icon button to open the chat widget
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary p-3 text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default UserChat;
