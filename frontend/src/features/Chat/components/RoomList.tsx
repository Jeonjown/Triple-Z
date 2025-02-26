import React from "react";

export interface LatestMessage {
  text?: string;
  createdAt?: string;
  username?: string;
  userId?: string; // For fetching user details
}

export interface Room {
  roomId: string;
  latestMessage?: LatestMessage;
}

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string;
  // Callback accepts roomId and optionally a userId from the room's latest message.
  onJoinRoom: (roomId: string, userId?: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  activeRoomId,
  onJoinRoom,
}) => {
  const handleRoomClick = (room: Room) => {
    const userId = room.latestMessage?.userId;
    console.log("Room clicked. Room:", room.roomId, "User:", userId);
    onJoinRoom(room.roomId, userId);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Chats</h1>
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
