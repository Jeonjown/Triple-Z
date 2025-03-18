import { useSendPushNotificationToUser } from "@/features/Notifications/hooks/useSendPushNotificationToUser";
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
  // Optional: the target user's FCM token to send the notification to.
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
  // Use the FCM push notification hook for sending a message to a user.
  const { mutate: sendPushNotification, isPending } =
    useSendPushNotificationToUser();

  // This handler wraps the original onSendMessage.
  const handleSendMessage = () => {
    // Send the chat message.
    onSendMessage();

    // If a push token is provided, trigger the FCM push notification.
    if (pushToken) {
      const payload = {
        token: pushToken,
        title: "New Chat Message",
        body: input, // You can customize the notification message here.
        icon: "/triple-z-logo.png", // Optional: adjust as needed.
        click_action: "/chat", // Optional: URL to navigate on click.
      };

      // Call the hook's mutate function to send the notification.
      sendPushNotification(payload);
    }
  };

  return (
    <div className="flex h-[90vh] flex-col">
      {/* Fixed Header: Display the username or a title */}
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
            if (e.key === "Enter") handleSendMessage();
          }}
          className="flex-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSendMessage}
          disabled={isPending} // Disable if the push notification request is pending
          className="ml-2 rounded-md bg-primary px-4 py-2 text-white transition hover:opacity-80"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
