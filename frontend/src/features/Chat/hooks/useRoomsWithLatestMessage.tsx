import { useQuery } from "@tanstack/react-query";
import { fetchRoomsWithLatestMessage, RoomLatestMessage } from "../api/message";

export const useRoomsWithLatestMessage = () => {
  return useQuery<RoomLatestMessage[], Error>({
    queryKey: ["rooms", "latestMessage"],
    queryFn: fetchRoomsWithLatestMessage,
  });
};
