import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { updateReservationPaymentStatus } from "../api/event";

// Define an interface for the update payment status input
interface UpdateReservationStatusArgs {
  reservationId: string;
  paymentStatus: string;
}

export const useUpdateReservationPaymentStatus = () => {
  const queryClient = useQueryClient();

  // Define the mutation with correct generics: <TData, TError, TVariables>
  const { mutate, isPending, isError, error } = useMutation<
    string, // TData: the API returns a string message
    Error, // TError: error object type
    UpdateReservationStatusArgs // TVariables: input variables type
  >({
    mutationFn: ({
      reservationId,
      paymentStatus,
    }: UpdateReservationStatusArgs) => {
      // Call the API function with paymentStatus first, then reservationId
      return updateReservationPaymentStatus(paymentStatus, reservationId);
    },
    onError: (err: Error) => {
      console.error("Error updating payment status:", err);
      // Display error toast with a descriptive message
      toast({
        title: "Error updating payment status",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: string) => {
      console.log("Payment status updated successfully:", data);
      // Invalidate the query to refresh reservations data
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      // Display success toast with a confirmation message
      toast({
        title: "Payment status updated",
        description: "The payment status was updated successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
