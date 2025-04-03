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
  const [showRooms, setShowRooms] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(true);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(true);

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

  const joinRoom = useCallback(
    (selectedRoomId?: string, roomUserId?: string) => {
      const newRoomId = selectedRoomId || roomId;
      if (!newRoomId.trim() || newRoomId === roomId) return;

      setInput("");
      setShowInput(false);
      if (showRooms) setShowRooms(false);

      setSelectedUserId(roomUserId || newRoomId.replace("room_", ""));
      if (roomId) socket.emit("leave-room", roomId);
      socket.emit("join-room", newRoomId, (ack: { status: string }) => {
        if (ack.status === "joined") {
          setRoomId(newRoomId);
          setJoined(true);
          setMessages([]);
          setShowInput(true);
        }
      });
    },
    [roomId, showRooms],
  );

  useEffect(() => {
    if (!roomId && rooms?.length) {
      const topRoom = rooms[0] as Room;
      joinRoom(topRoom.roomId, topRoom.latestMessage?.userId);
    }
  }, [rooms, roomId, joinRoom]);

  useEffect(() => {
    if (fetchedMessages && roomId) {
      setMessages(
        fetchedMessages.map((msg) => ({
          ...msg,
          _id: msg._id ?? "",
          userId: msg.userId ?? "",
          username: msg.username ?? "",
        })),
      );
    }
  }, [fetchedMessages, roomId]);

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

  const toggleUserDetails = () => {
    setShowUserDetails(!showUserDetails);
  };

  return (
    <div className="flex h-screen flex-col md:grid md:grid-cols-12">
      {/* Mobile Header */}
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

      {/* Sidebar */}
      <aside
        className={`absolute left-0 top-0 z-10 mt-12 h-[calc(100%-3rem)] w-full transform border-r bg-white p-4 transition-transform md:static md:z-0 md:col-span-3 md:mt-0 md:h-auto md:translate-x-0 ${
          showRooms ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <RoomList
          rooms={rooms as Room[]}
          activeRoomId={roomId}
          onJoinRoom={joinRoom}
          onClose={() => setShowRooms(false)}
        />
      </aside>

      {/* Main Chat */}
      <main
        className={`flex h-full flex-col transition-all duration-300 ${
          showUserDetails && userInfo
            ? "md:col-span-7 lg:col-span-6"
            : "md:col-span-9"
        }`}
      >
        <div className="flex items-center justify-between border-b bg-white p-2">
          <button
            className="hidden rounded border px-2 py-1 md:block lg:hidden"
            onClick={toggleUserDetails}
          >
            {showUserDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>
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
            showInput={showInput && !showRooms}
          />
        )}
      </main>

      {/* User Details */}
      {showUserDetails && userInfo && (
        <aside className="hidden border-l bg-white p-4 lg:col-span-3 lg:block">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">User Details</h2>
            <button
              className="rounded p-1 hover:bg-gray-100 lg:hidden"
              onClick={toggleUserDetails}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <UserDetails user={userInfo} />
        </aside>
      )}

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
