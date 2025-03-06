import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteEventReservation } from "../api/event";

// Custom hook to delete a reservation
export const useDeleteReservations = () => {
  const queryClient = useQueryClient();

  // Define the mutation: TData is string (returned message), TError is Error, TVariables is string (reservationId)
  const { mutate, isPending, isError, error } = useMutation<
    string, // Response data type
    Error, // Error type
    string // Input type (reservationId)
  >({
    // mutationFn takes a reservationId and calls the API delete function
    mutationFn: (reservationId: string) =>
      deleteEventReservation(reservationId),
    // onSuccess: Invalidate the reservations query so data refreshes, and show a success toast
    onSuccess: (data: string) => {
      console.log("Reservation deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Reservation Deleted",
        description: "The reservation was deleted successfully.",
        variant: "default",
      });
    },
    // onError: Log error and display an error toast
    onError: (err: Error) => {
      console.error("Error deleting reservation:", err);
      toast({
        title: "Error deleting reservation",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
