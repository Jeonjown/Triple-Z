import React from "react";

interface LatestMessage {
  text?: string;
  createdAt?: string;
}

export interface Room {
  roomId: string;
  latestMessage?: LatestMessage;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onJoinRoom }) => {
  return (
    <div className="mb-4 border p-4">
      <h2 className="mb-2 font-semibold">Available Rooms</h2>
      {rooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => onJoinRoom(room.roomId)}
          className="mb-2 cursor-pointer border p-2 hover:underline"
        >
          <p>
            <strong>Room ID:</strong> {room.roomId}
          </p>
          <p>
            <strong>Latest Message:</strong>{" "}
            {room.latestMessage?.text || "No messages yet"}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {room.latestMessage?.createdAt
              ? new Date(room.latestMessage.createdAt).toLocaleString()
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
