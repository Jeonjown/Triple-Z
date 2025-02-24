import React, { ChangeEvent, KeyboardEvent } from "react";

interface Message {
  _id: string;
  text: string;
  sender: "user" | "admin";
  roomId: string;
  createdAt?: string;
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
  roomId,
  messages,
  input,
  onInputChange,
  onSendMessage,
  messagesLoading,
  messagesError,
}) => {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Room: {roomId}</h2>
      <div className="mb-4 h-64 overflow-y-auto border p-4">
        {messagesLoading && <p>Loading messages...</p>}
        {messagesError && (
          <p>Error loading messages: {messagesError.message}</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "admin" ? "text-blue-600" : "text-black"
            }`}
          >
            <strong>{msg.sender === "admin" ? "Admin" : "User"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
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
          className="flex-1 border p-2"
        />
        <button
          onClick={onSendMessage}
          className="ml-2 rounded bg-primary p-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
