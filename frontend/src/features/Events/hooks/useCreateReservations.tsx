import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventReservation, Reservation } from "../api/event";
import { toast } from "@/hooks/use-toast";
import { EventFormValues } from "../pages/EventForm";
import { useParams } from "react-router-dom";

export const useCreateReservations = () => {
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { mutate, isPending, isError, error } = useMutation<
    Reservation, // Return type on success
    Error, // Error type
    EventFormValues // Input type
  >({
    mutationFn: (values: EventFormValues) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return createEventReservation(values, userId);
    },
    onError: (err: Error) => {
      console.error("Error creating reservation:", err);
      toast({
        title: "Error creating reservation",
        description: err.message, // Use the error message provided by the API
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Reservation created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["eventReservations"] });
      toast({
        title: "Reservation created",
        description: "The reservation was created successfully.",
        variant: "default",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
