import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventReservationStatus } from "../api/event";
import { toast } from "@/hooks/use-toast";

// Define an interface for the update status input
interface UpdateReservationStatusArgs {
  reservationId: string;
  eventStatus: string;
}

export const useUpdateEventReservationStatus = () => {
  const queryClient = useQueryClient();

  // Use a specific type for the mutation input
  const { mutate, isPending, isError, error } = useMutation<
    string,
    Error, // Error type
    UpdateReservationStatusArgs // Input type for mutation function
  >({
    // Correctly type the destructured parameter as UpdateReservationStatusArgs
    mutationFn: ({
      reservationId,
      eventStatus,
    }: UpdateReservationStatusArgs) => {
      // Call the API function with eventStatus first, then reservationId
      return updateEventReservationStatus(eventStatus, reservationId);
    },
    onError: (err) => {
      console.error("Error updating reservation:", err);
      toast({
        title: "Error updating reservation",
        description: `${err}`,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Reservation updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Reservation updated",
        description: "The reservation status was updated successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
