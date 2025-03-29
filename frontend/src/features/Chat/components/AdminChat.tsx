import React, { useState, useEffect, useCallback } from "react";
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
import { socket } from "@/socket";
import { X } from "lucide-react";

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
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  // State for mobile room list visibility
  const [showRooms, setShowRooms] = useState<boolean>(false);
  // State for controlling the input display
  const [showInput, setShowInput] = useState<boolean>(true);

  // Set up sound preferences and lock body scroll
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
  console.log("message from AdminChat,", fetchedMessages);

  useEffect(() => {
    if (Notification.permission === "default") setDialogOpen(true);
  }, []);

  // Join room function: clear input, hide it, and auto-close room list
  const joinRoom = useCallback(
    (selectedRoomId?: string, roomUserId?: string) => {
      const newRoomId = selectedRoomId || roomId;
      if (!newRoomId.trim() || newRoomId === roomId) return;

      // Clear input and hide it while switching rooms
      setInput("");
      setShowInput(false);

      // Auto-close the room list on mobile
      if (showRooms) setShowRooms(false);

      setSelectedUserId(roomUserId || newRoomId.replace("room_", ""));
      if (roomId) socket.emit("leave-room", roomId);
      socket.emit("join-room", newRoomId, (ack: { status: string }) => {
        if (ack.status === "joined") {
          setRoomId(newRoomId);
          setJoined(true);
          setMessages([]);
          // Show input after room has been joined
          setShowInput(true);
        }
      });
    },
    [roomId, showRooms],
  );

  // Auto-join the first room on mount
  useEffect(() => {
    if (!roomId && rooms?.length) {
      const topRoom = rooms[0] as Room;
      joinRoom(topRoom.roomId, topRoom.latestMessage?.userId);
    }
  }, [rooms, roomId, joinRoom]);

  // Update messages when new messages are fetched
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

  // Listen for real-time updates and update room list
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
            updatedRooms[roomIndex] = {
              ...updatedRooms[roomIndex],
              latestMessage: {
                ...updatedRooms[roomIndex].latestMessage,
                text: data.text,
                createdAt: data.createdAt,
              },
            };
          } else if (data.sender === "user") {
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

  // Send an admin message
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

  return (
    <div className="flex h-[100dvh] flex-col md:grid md:grid-cols-12">
      {/* Mobile Header with room toggle */}
      <div className="flex items-center justify-between border-b bg-white p-2 md:hidden">
        <div className="flex items-center space-x-2">
          <button
            className="rounded border px-2 py-1"
            onClick={() => setShowRooms((prev) => !prev)}
          >
            Chats
          </button>
          {showRooms && (
            <button onClick={() => setShowRooms(false)}>
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar: Room List */}
      <aside
        className={`absolute left-0 top-0 mt-20 h-full w-full transform border-r bg-white p-4 transition-transform md:static md:col-span-2 md:mt-0 md:translate-x-0 ${
          showRooms ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <RoomList
          rooms={rooms as Room[]}
          activeRoomId={roomId}
          onJoinRoom={joinRoom}
          onClose={() => setShowRooms(false)}
        />
        <button className="mt-4 md:hidden" onClick={() => setShowRooms(false)}>
          Close
        </button>
      </aside>

      {/* Main Chat Window */}
      <main className="flex flex-col md:col-span-7">
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
            pushToken={selectedUserId}
            // Hide input when the room list is open
            showInput={showInput && !showRooms}
          />
        )}
      </main>

      {/* UserDetails: visible on large screens */}
      <aside className="hidden border-l bg-white p-4 lg:col-span-3 lg:block">
        <UserDetails user={userInfo} />
      </aside>

      {/* Notification Dialog */}
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
            <Button onClick={() => setDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChat;
