// RoomList.tsx
import React from "react";
import { X } from "lucide-react";

export interface LatestMessage {
  text?: string;
  createdAt?: string;
  username?: string;
  userId?: string;
}

export interface Room {
  roomId: string;
  latestMessage?: LatestMessage;
}

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string;
  onJoinRoom: (roomId: string, userId?: string) => void;
  onClose?: () => void;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  activeRoomId,
  onJoinRoom,
  onClose,
}) => {
  const handleRoomClick = (room: Room) => {
    const userId = room.latestMessage?.userId;
    console.log("Room clicked. Room:", room.roomId, "User:", userId);
    onJoinRoom(room.roomId, userId);
  };

  return (
    // Fixed height with overflow-y-auto for scrolling through room list
    <div className="h-full max-h-screen w-full overflow-y-auto p-4">
      {/* Header with title and close button */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chats</h1>
        {onClose && (
          <button className="md:hidden" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => handleRoomClick(room)}
            className={`cursor-pointer rounded p-3 transition ${
              activeRoomId === room.roomId ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            <p className="text-sm font-semibold">
              {room.latestMessage?.username || "Guest"}
            </p>
            <p className="text-xs text-gray-600">
              {room.latestMessage?.text || "No messages yet"}
            </p>
            {room.latestMessage?.createdAt && (
              <p className="text-xs text-gray-500">
                {new Date(room.latestMessage.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
