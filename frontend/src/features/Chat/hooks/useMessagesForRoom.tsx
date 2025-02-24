import { useQuery } from "@tanstack/react-query";

import { fetchMessagesForRoom, Message } from "../api/message";
export const useMessagesForRoom = (roomId: string) => {
  return useQuery<Message[], Error>({
    queryKey: ["messages", roomId],
    queryFn: () => fetchMessagesForRoom(roomId),
    enabled: Boolean(roomId),
  });
};
