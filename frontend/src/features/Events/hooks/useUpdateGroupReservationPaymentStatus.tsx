// useUpdateGroupReservationPaymentStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { updateGroupReservationPaymentStatus } from "../api/group";

interface UpdateGroupReservationPaymentStatusArgs {
  reservationId: string;
  paymentStatus: string;
}

export const useUpdateGroupReservationPaymentStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    string,
    Error,
    UpdateGroupReservationPaymentStatusArgs
  >({
    mutationFn: ({
      reservationId,
      paymentStatus,
    }: UpdateGroupReservationPaymentStatusArgs) =>
      updateGroupReservationPaymentStatus(paymentStatus, reservationId),
    onError: (err: Error) => {
      console.error("Error updating group reservation payment status:", err);
      toast({
        title: "Error updating payment status",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: string) => {
      console.log("Group payment status updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Payment status updated",
        description: "The payment status was updated successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
