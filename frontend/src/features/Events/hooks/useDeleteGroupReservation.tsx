// useDeleteGroupReservation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { deleteGroupReservation } from "../api/group";

export const useDeleteGroupReservation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    string,
    Error,
    string
  >({
    mutationFn: (reservationId: string) =>
      deleteGroupReservation(reservationId),
    onSuccess: (data: string) => {
      console.log("Group reservation deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation Deleted",
        description: "The group reservation was deleted successfully.",
        variant: "default",
      });
    },
    onError: (err: Error) => {
      console.error("Error deleting group reservation:", err);
      toast({
        title: "Error deleting reservation",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
