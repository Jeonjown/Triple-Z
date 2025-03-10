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
import { useServiceworker } from "@/features/Notifications/hooks/useServiceWorker";
import { playPingSound } from "@/utils/playPingSound";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

export interface Message {
  userId: string;
  _id: string;
  text: string;
  sender: "user" | "admin";
  roomId: string;
  createdAt?: string;
  username?: string;
}

const AdminChat: React.FC = () => {
  const { user } = useAuthStore();
  const { registerAndSubscribe } = useServiceworker();
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  // Sound preferences and UI setup
  useEffect(() => {
    const storedSoundPref = localStorage.getItem("soundEnabled");
    if (storedSoundPref !== null) {
      setSoundEnabled(storedSoundPref === "true");
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  const queryClient = useQueryClient();
  const { data: rooms = [] } = useRoomsWithLatestMessage();
  const { data: fetchedMessages, isPending: messagesLoading } =
    useMessagesForRoom(roomId);
  const { data: userInfo } = useGetUser(selectedUserId);

  useEffect(() => {
    if (Notification.permission === "default") setDialogOpen(true);
  }, []);

  // Room management
  const joinRoom = useCallback(
    (selectedRoomId?: string, roomUserId?: string) => {
      const newRoomId = selectedRoomId || roomId;
      if (!newRoomId.trim() || newRoomId === roomId) return;

      setSelectedUserId(roomUserId || newRoomId.replace("room_", ""));

      if (roomId) socket.emit("leave-room", roomId);

      socket.emit("join-room", newRoomId, (ack: { status: string }) => {
        if (ack.status === "joined") {
          setRoomId(newRoomId);
          setJoined(true);
          setMessages([]);
        }
      });
    },
    [roomId],
  );

  useEffect(() => {
    if (!roomId && rooms?.length) {
      const topRoom = rooms[0] as Room;
      joinRoom(topRoom.roomId, topRoom.latestMessage?.userId);
    }
  }, [rooms, roomId, joinRoom]);

  // Message handling
  useEffect(() => {
    if (joined && fetchedMessages) {
      setMessages(
        fetchedMessages.map((msg) => ({
          ...msg,
          _id: msg._id ?? "",
          userId: msg.userId ?? "",
          username: msg.username ?? "",
        })),
      );
    }
  }, [fetchedMessages, joined]);

  // Real-time updates
  useEffect(() => {
    const updateRoomList = (data: Message) => {
      queryClient.setQueryData<Room[]>(
        ["rooms", "latestMessage"],
        (oldRooms = []) => {
          const updatedRooms = [...oldRooms];
          const roomIndex = updatedRooms.findIndex(
            (room) => room.roomId === data.roomId,
          );

          if (roomIndex > -1) {
            // Preserve original username and user ID, only update message and timestamp
            updatedRooms[roomIndex] = {
              ...updatedRooms[roomIndex],
              latestMessage: {
                ...updatedRooms[roomIndex].latestMessage,
                text: data.text,
                createdAt: data.createdAt,
              },
            };
          } else if (data.sender === "user") {
            // Only create new rooms for user messages
            updatedRooms.push({
              roomId: data.roomId,
              latestMessage: {
                text: data.text,
                createdAt: data.createdAt,
                username: data.username,
                userId: data.userId,
              },
            });
          }

          // Sort by latest message timestamp
          return updatedRooms.sort((a, b) => {
            const aTime = new Date(a.latestMessage?.createdAt || 0).getTime();
            const bTime = new Date(b.latestMessage?.createdAt || 0).getTime();
            return bTime - aTime;
          });
        },
      );
    };

    const handleNewMessage = (data: Message) => {
      updateRoomList(data);

      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
        if (soundEnabled) playPingSound();
      }
    };

    socket.on("new-user-message", updateRoomList);
    socket.on("new-admin-message", updateRoomList);
    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.off("new-user-message", updateRoomList);
      socket.off("new-admin-message", updateRoomList);
      socket.off("receive-message", handleNewMessage);
      if (roomId) socket.emit("leave-room", roomId);
    };
  }, [roomId, soundEnabled, queryClient]);

  // Message sending
  const sendAdminMessage = () => {
    if (!input.trim() || !joined) return;
    const adminMessage: Message = {
      _id: user!._id,
      text: input,
      sender: "admin",
      roomId,
      userId: user?._id || "",
      createdAt: new Date().toISOString(),
      username: user?.username ?? "Admin",
    };
    socket.emit("admin-message", adminMessage);
    setInput("");
  };

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No User Messages</p>
      </div>
    );
  }

  return (
    <div className="inset-0 grid h-screen grid-cols-12">
      <div className="col-span-3 border-r bg-white">
        {rooms?.length > 0 && (
          <RoomList
            rooms={rooms as Room[]}
            activeRoomId={roomId}
            onJoinRoom={joinRoom}
          />
        )}
      </div>

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
          />
        )}
      </div>

      <div className="col-span-3 border-l bg-white">
        <UserDetails user={userInfo} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications?</DialogTitle>
            <DialogDescription>
              Receive push notifications for new messages
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
              No
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
