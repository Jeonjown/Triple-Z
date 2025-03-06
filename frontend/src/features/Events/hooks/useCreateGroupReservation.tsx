// useCreateGroupReservation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import {
  GroupReservation,
  GroupReservationFormValues,
  createGroupReservation,
} from "../api/group";

export const useCreateGroupReservation = () => {
  const queryClient = useQueryClient();
  const { userId } = useParams<{ userId: string }>();
  console.log("user id from use hook:", userId);

  const { mutate, isPending, isError, error } = useMutation<
    GroupReservation,
    Error,
    GroupReservationFormValues
  >({
    mutationFn: (values: GroupReservationFormValues) => {
      console.log(values);
      if (!userId) {
        throw new Error("User ID is required");
      }
      return createGroupReservation(values, userId);
    },
    onError: (err: Error) => {
      console.error("Error creating group reservation:", err);
      toast({
        title: "Error creating reservation",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: GroupReservation) => {
      console.log("Group reservation created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["groupReservations"] });
      toast({
        title: "Reservation created",
        description: "The group reservation was created successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
