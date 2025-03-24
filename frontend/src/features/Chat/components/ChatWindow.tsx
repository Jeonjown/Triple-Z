// ChatWindow.tsx
import React, { ChangeEvent, KeyboardEvent } from "react";
import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";

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
  pushToken?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onInputChange,
  onSendMessage,
  messagesLoading,
  messagesError,
  pushToken,
}) => {
  const { mutate: sendPushNotification, isPending } =
    useSendPushNotificationToUser();

  // Function to handle sending a message
  const handleSendMessage = () => {
    onSendMessage();
    if (pushToken) {
      const payload = {
        userId: pushToken,
        title: "New Chat Message",
        body: input,
        icon: "/triple-z-logo.svg",
        click_action: "/",
      };
      sendPushNotification(payload);
    }
  };

  return (
    // Outer container has a full screen height
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="bg-primary px-4 py-3 font-bold text-white">
        {messages[0]?.username || "Chat"}
      </div>

      {/* Scrollable messages container with increased bottom padding */}
      <div className="flex-1 overflow-y-auto p-4 pb-72">
        {messagesLoading && <p>Loading messages...</p>}
        {messagesError && (
          <p className="text-red-500">Error: {messagesError.message}</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 flex">
            <div
              className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                msg.sender === "admin"
                  ? "ml-auto rounded-br-none bg-primary text-white"
                  : "mr-auto rounded-bl-none border bg-blue-500 text-white"
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

      {/* Input area is fixed on mobile and static on tablet screens */}
      <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full border-t bg-white p-4 md:static md:mb-28">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInputChange(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSendMessage}
          disabled={isPending}
          className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-white transition hover:opacity-80"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
