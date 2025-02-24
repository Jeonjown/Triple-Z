import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import useAuthStore from "@/features/Auth/stores/useAuthStore";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
}

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  // Listen for incoming messages once when the component mounts
  useEffect(() => {
    socket.on("receive-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = (): void => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: user?._id || "",
      text: input,
      // Ensure sender is either "user" or "admin"
      sender: user?.role === "admin" ? "admin" : "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    socket.emit("send-message", newMessage);
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

export default Chat;
