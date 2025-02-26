// ChatWindow.tsx
import React, { ChangeEvent, KeyboardEvent } from "react";

interface Message {
  _id: string;
  text: string;
  sender: "user" | "admin";
  roomId: string;
  createdAt?: string;
  username?: string;
}

interface ChatWindowProps {
  roomId: string;
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  messagesLoading?: boolean;
  messagesError?: Error | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onInputChange,
  onSendMessage,
  messagesLoading,
  messagesError,
}) => {
  return (
    <div className="flex h-[90vh] flex-col">
      {/* Fixed Header: Display the username once */}
      <div className="bg-primary px-4 py-3 font-bold text-white">
        {messages[0]?.username || "Chat"}
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messagesLoading && <p>Loading messages...</p>}
        {messagesError && (
          <p className="text-red-500">Error: {messagesError.message}</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 flex">
            <div
              className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                msg.sender === "admin"
                  ? "ml-auto rounded-bl-none bg-primary text-white"
                  : "mr-auto rounded-br-none border bg-blue-500 text-white"
              }`}
            >
              <p>
                <strong>{msg.sender === "admin" ? "Admin" : "User"}:</strong>{" "}
                {msg.text}
              </p>
              {msg.createdAt && (
                <span className="mt-1 block text-xs text-gray-200">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Input Area */}
      <div className="flex items-center border-t bg-white p-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInputChange(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") onSendMessage();
          }}
          className="flex-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={onSendMessage}
          className="ml-2 rounded-md bg-primary px-4 py-2 text-white transition hover:opacity-80"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
