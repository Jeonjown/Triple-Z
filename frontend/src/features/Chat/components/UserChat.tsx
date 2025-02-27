import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { v4 as uuid } from "uuid"; // Import uuid for generating unique IDs
import { useSendNotificationToAdmin } from "@/notifications/hooks/useSendNotificationToAdmins";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

interface Message {
  roomId: string;
  userId: string;
  text: string;
  sender: "user" | "admin";
}

const UserChat: React.FC = () => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const { mutate } = useSendNotificationToAdmin();
  // Step 1: Determine the room ID based on user authentication.
  // If a user is logged in, use their unique ID. Otherwise, generate and store a unique ID.
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

  // Step 2: If the user logs in (or their info changes), update the room ID accordingly.
  useEffect(() => {
    if (user?._id) {
      const newRoom = `room_${user._id}`;
      if (newRoom !== roomId) {
        setRoomId(newRoom);
      }
    }
  }, [user?._id, roomId]);

  // Step 3: Join the room and set up the message listener.
  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("receive-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up the listener on component unmount or roomId change.
    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  // Step 4: Send a message using the appropriate room ID.
  const sendMessage = (): void => {
    if (input.trim() === "") return;
    const newMessage: Message = {
      roomId,
      // Use the user's ID if available; otherwise, use the roomId as an identifier.
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
                  {msg.sender === "user" ? "You" : "Admin"}
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
