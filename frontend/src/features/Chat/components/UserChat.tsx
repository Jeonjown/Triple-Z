import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useRef,
} from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { v4 as uuid } from "uuid";
import { useMessagesForRoom } from "../hooks/useMessagesForRoom";
import { useSendPushNotificationToAdmins } from "@/features/Notifications/hooks/useSendPushNotificationToAdmins";
import { socket } from "@/socket";

interface Message {
  roomId: string;
  userId: string;
  text: React.ReactNode;
  sender: "user" | "admin" | "system";
  username?: string;
}

const UserChat: React.FC = () => {
  const { user } = useAuthStore();

  // Initialize roomId: use the user ID or generate one for guest users
  const [roomId, setRoomId] = useState<string>(() => {
    if (user?._id) {
      return `room_${user._id}`;
    }
    let storedRoom = localStorage.getItem("chatRoomId");
    if (!storedRoom) {
      storedRoom = `room_${uuid()}`;
      localStorage.setItem("chatRoomId", storedRoom);
    }
    return storedRoom;
  });

  // Fetch chat history for the room (custom hook)
  const { data } = useMessagesForRoom(roomId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Define instant reply options based on FAQ and Contacts
  const [
    instantReplyOptions,
    /* eslint-disable @typescript-eslint/no-unused-vars */ setInstantReplyOptions /* eslint-enable @typescript-eslint/no-unused-vars */,
  ] = useState<string[]>([
    "What are your operating hours?",
    "How can I make a reservation?",
    "Where are you located?",
    "What is your contact information?",
    "Can I book for a private event?",
    "Is dine-in available during events?",
  ]);

  // Automated reply states
  const [isAutomatedReplySent, setIsAutomatedReplySent] =
    useState<boolean>(false);
  const automatedReplyText =
    "Hello! Welcome to Triple Z. While our team is not immediately available, you can click the options below for instant answers to common questions!";
  const [isAdminTyping, setIsAdminTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize the admin push notification hook
  const { mutate: notifyAdmins, isPending: notifyAdminsPending } =
    useSendPushNotificationToAdmins();

  // Set messages when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setMessages(data);
    }
  }, [data]);

  // Update roomId when the user logs in or changes
  useEffect(() => {
    if (user?._id) {
      const newRoom = `room_${user._id}`;
      if (newRoom !== roomId) {
        setRoomId(newRoom);
        setIsAutomatedReplySent(false); // Reset automated reply on room change
      }
    } else {
      setIsAutomatedReplySent(false); // Reset if user logs out
    }
  }, [user?._id, roomId]);

  // Manage socket room joining and message reception
  useEffect(() => {
    socket.emit("join-room", roomId);

    const messageHandler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
      socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  // Send automated reply on chat open with delay and typing animation
  useEffect(() => {
    if (open && !isAutomatedReplySent) {
      const initialDelayTimeout = setTimeout(() => {
        setIsAdminTyping(true);

        const typingSimulationTimeout = setTimeout(() => {
          setIsAdminTyping(false);
          setIsAutomatedReplySent(true);
          const automatedMessage: Message = {
            roomId,
            userId: "system",
            text: automatedReplyText,
            sender: "system",
          };
          setMessages((prev) => [...prev, automatedMessage]);
        }, 2000); // Typing simulation duration

        return () => clearTimeout(typingSimulationTimeout);
      }, 1000); // Initial delay

      return () => clearTimeout(initialDelayTimeout);
    } else if (!open) {
      setIsAdminTyping(false);
      setIsAutomatedReplySent(false);
    }
  }, [open, isAutomatedReplySent, roomId, automatedReplyText]);

  // Send a message via socket and trigger admin notifications if needed
  const sendMessage = (
    messageToSend: string = input,
    isUserInitiated: boolean = true,
  ): void => {
    if (messageToSend.trim() === "") return;

    const newMessage: Message = {
      roomId,
      userId: user?._id || roomId,
      text: messageToSend,
      sender: user?.role === "admin" ? "admin" : "user",
    };

    setInput(""); // Clear input

    // Only send to socket if it's a user-initiated message
    if (newMessage.sender === "user" && isUserInitiated) {
      socket.emit("send-message", newMessage);

      // For non-admin users, notify admins via the FCM hook
      if (user?.role !== "admin") {
        const notificationPayload = {
          title: "New Message Received",
          body: `Message: ${newMessage.text}`,
        };
        notifyAdmins(notificationPayload);
      }
    }
  };

  // Handle click on instant reply options without sending the message via socket
  const handleInstantReplyClick = (reply: string) => {
    // Send the reply locally only (do not emit socket message)
    sendMessage(reply, false);

    // Simulate admin typing
    setIsAdminTyping(true);

    // Introduce a delay before the admin response
    setTimeout(() => {
      setIsAdminTyping(false);
      let automatedResponse: React.ReactNode = "";
      switch (reply) {
        case "What are your operating hours?":
          automatedResponse =
            "We are open from 4:00 PM to 10:00 PM, seven days a week.";
          break;
        case "How can I make a reservation?":
          automatedResponse = (
            <>
              You can make a reservation by clicking 'Book Now' on our homepage
              or by visiting the{" "}
              <Link to="/schedule" className="underline">
                Events
              </Link>{" "}
              section. For detailed steps, please check our{" "}
              <Link to="/faqs" className="underline">
                FAQs
              </Link>
              .
            </>
          );
          break;
        case "Where are you located?":
          automatedResponse = (
            <>
              We are located at 64 P Burgos St, Taguig, Metro Manila. You can
              find our exact location on our{" "}
              <Link to="/contacts" className="underline">
                contact page
              </Link>
              .
            </>
          );
          break;
        case "What is your contact information?":
          automatedResponse = (
            <>
              You can reach us via email at triplez.main@gmail.com or call us at
              0942-427-1054. More details are available on our{" "}
              <Link to="/contacts" className="underline">
                contact page
              </Link>
              .
            </>
          );
          break;
        case "Can I book for a private event?":
          automatedResponse = (
            <>
              Yes, you can book our space for private events. Please visit the{" "}
              <Link to="/schedule" className="underline">
                Events
              </Link>{" "}
              section and click 'Schedule' to start the booking process. Note
              that bookings must be made at least two weeks in advance. See our{" "}
              <Link to="/faqs" className="underline">
                FAQs
              </Link>{" "}
              for more details.
            </>
          );
          break;
        case "Is dine-in available during events?":
          automatedResponse = (
            <>
              During private events, dine-in service may not be available for
              walk-in customers. However, we still welcome walk-ins for takeout
              orders. Please check our{" "}
              <Link to="/faqs" className="underline">
                FAQs
              </Link>{" "}
              for more information.
            </>
          );
          break;
        default:
          automatedResponse = "Thank you for your query!";
      }

      if (automatedResponse) {
        const instantReplyMessage: Message = {
          roomId,
          userId: "system",
          text: automatedResponse,
          sender: "admin", // Display as admin message
        };
        setMessages((prev) => [...prev, instantReplyMessage]);
      }
    }, 2000); // Adjust delay as needed
  };

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide chat for admin users
  if (user?.role === "admin") return null;

  return (
    <div className="fixed bottom-10 right-10 z-30">
      {open ? (
        <div className="flex h-[600px] w-[500px] flex-col rounded-lg border bg-white shadow-lg">
          {/* Chat Header */}
          <div className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-2 text-white">
            <span className="text-lg font-semibold">Support Chat</span>
            <button onClick={() => setOpen(false)} className="text-xl">
              &times;
            </button>
          </div>
          {/* Messages Area */}
          <div
            className="flex-1 space-y-2 overflow-y-auto p-4"
            ref={messagesEndRef}
          >
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
                <p className="break-words">{msg.text}</p>
              </div>
            ))}
            {/* Typing Indicator */}
            {isAdminTyping && (
              <div className="self-start rounded bg-gray-200 p-2 text-black">
                <p className="text-sm font-bold">Admin</p>
                <div className="mt-4 flex gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:.1s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:.2s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:.3s]"></span>
                </div>
              </div>
            )}
          </div>
          {/* Instant Reply Options */}
          <div className="border-t px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {instantReplyOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleInstantReplyClick(option)}
                  className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {option}
                </button>
              ))}
            </div>
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
              onClick={() => sendMessage()}
              disabled={notifyAdminsPending}
              className="ml-2 rounded bg-primary px-3 py-2 text-white"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        // Chat icon button to open the chat widget.
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
