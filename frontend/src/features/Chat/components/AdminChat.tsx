import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import RoomList, { Room } from "./RoomList";
import ChatWindow from "./ChatWindow";
import UserDetails from "./UserDetails";
import { useRoomsWithLatestMessage } from "../hooks/useRoomsWithLatestMessage";
import { useMessagesForRoom } from "../hooks/useMessagesForRoom";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useGetUser } from "@/features/Users/hooks/useGetUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useServiceworker } from "@/notifications/hooks/useServiceWorker";
import { playPingSound } from "@/utils/playPingSound";

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
  const { registerAndSubscribe } = useServiceworker();
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  // State to track whether sound notifications are enabled.
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Dialog state for enabling notifications and sound.
  const [dialogOpen, setDialogOpen] = useState(false);
  // State to track the selected user for details.
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );

  // On mount, load the persisted sound preference.
  useEffect(() => {
    const storedSoundPref = localStorage.getItem("soundEnabled");
    if (storedSoundPref !== null) {
      setSoundEnabled(storedSoundPref === "true");
    }
  }, []);

  // Persist soundEnabled changes to localStorage.
  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    // Disable scrolling on mount.
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Create a query client to update queries later.
  const queryClient = useQueryClient();

  // Fetch rooms with their latest messages.
  const { data: rooms } = useRoomsWithLatestMessage();
  // Fetch historical messages for the current room.
  const {
    data: fetchedMessages,
    isPending: messagesLoading,
    error: messagesError,
  } = useMessagesForRoom(roomId);
  // Fetch user details for the selected user.
  const { data: userInfo, isPending, error } = useGetUser(selectedUserId);

  // Prompt for notifications if the permission is still default.
  useEffect(() => {
    if (Notification.permission === "default") {
      setDialogOpen(true);
    }
  }, []);

  const joinRoom = useCallback(
    (selectedRoomId?: string, roomUserId?: string) => {
      const adminUserId = user?._id;
      let newRoomId = selectedRoomId || roomId;
      if (roomUserId === adminUserId && adminUserId) {
        newRoomId = `room_${adminUserId}`;
      }
      if (newRoomId.trim() === "") return;
      socket.emit("join-room", newRoomId);
      setRoomId(newRoomId);
      setJoined(true);
      setMessages([]);
      if (roomUserId) {
        setSelectedUserId(roomUserId);
      } else {
        setSelectedUserId(undefined);
      }
    },
    [roomId, user],
  );

  // Automatically select the top room if none is selected.
  useEffect(() => {
    if (!roomId && rooms && rooms.length > 0) {
      const topRoom = rooms[0] as Room;
      joinRoom(topRoom.roomId, topRoom.latestMessage?.userId);
    }
  }, [rooms, roomId, joinRoom]);

  // Update messages when historical messages are fetched.
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

  // Listen for real-time messages.
  useEffect(() => {
    socket.on("receive-message", (data: Message) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
        // If sound notifications are enabled, play the ping sound.
        if (soundEnabled) {
          playPingSound();
        }
      }
      queryClient.setQueryData<Room[]>(
        ["rooms", "latestMessage"],
        (oldRooms) => {
          if (!oldRooms) return oldRooms;
          return oldRooms.map((room) => {
            if (room.roomId === data.roomId) {
              return {
                ...room,
                latestMessage: {
                  text: data.text,
                  createdAt: data.createdAt,
                  username: data.sender === "user" ? data.userId : "Admin",
                  userId: data.userId,
                },
              };
            }
            return room;
          });
        },
      );
    });
    return () => {
      socket.off("receive-message");
    };
  }, [roomId, queryClient, soundEnabled]);

  // Send an admin message.
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

  // If no user information is available, show a centered message.
  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No User Messages</p>
      </div>
    );
  }

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
        {messagesLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No messages found.
          </div>
        ) : (
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

      {/* Right Sidebar: User Details */}
      <div className="col-span-3 border-l bg-white">
        <UserDetails user={userInfo} isPending={isPending} error={error} />
      </div>

      {/* Dialog for enabling push and sound notifications */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications?</DialogTitle>
            <DialogDescription>
              Please turn on notifications to receive push notifications for
              messages on this device.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex items-center">
            <input
              type="checkbox"
              id="soundNotifications"
              className="mr-2"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <label htmlFor="soundNotifications">
              Enable sound notifications
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              No, proceed
            </Button>
            <Button
              onClick={async () => {
                setDialogOpen(false);
                await registerAndSubscribe();
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChat;
