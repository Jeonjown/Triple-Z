// useUpdateGroupReservationStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { updateGroupReservationStatus } from "../api/group";

// Define the input type for updating group reservation status
interface UpdateGroupReservationStatusArgs {
  reservationId: string;
  eventStatus: string;
}

export const useUpdateGroupReservationStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    string, // API returns a success message
    Error,
    UpdateGroupReservationStatusArgs
  >({
    mutationFn: ({
      reservationId,
      eventStatus,
    }: UpdateGroupReservationStatusArgs) =>
      updateGroupReservationStatus(eventStatus, reservationId),
    onError: (err) => {
      console.error("Error updating group reservation status:", err);
      toast({
        title: "Error updating reservation",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Group reservation updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation updated",
        description: "The group reservation status was updated successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
