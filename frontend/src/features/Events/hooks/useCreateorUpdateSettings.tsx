import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  createOrUpdateEventSettings,
  EventReservationSettings,
} from "../api/event";

// Custom hook for creating or updating event settings
export const useCreateOrUpdateSettings = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    EventReservationSettings, // TData: the returned settings
    Error, // TError: error type
    Partial<EventReservationSettings> // TVariables: input settings object
  >({
    mutationFn: (settings: Partial<EventReservationSettings>) =>
      createOrUpdateEventSettings(settings),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Event settings have been updated successfully.",
        variant: "default",
      });
      // Invalidate the event settings query so the data refreshes
      queryClient.invalidateQueries({ queryKey: ["eventSettings"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Error Updating Settings",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending, isError, error };
};
