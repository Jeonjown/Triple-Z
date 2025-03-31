import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { toast } from "@/hooks/use-toast";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export interface UnavailableDate {
  _id: string;
  date: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MarkUnavailableDatePayload {
  date: string; // e.g., "2025-04-15"
  reason: string;
}

interface MarkUnavailableDateResponse {
  message: string;
  date: UnavailableDate;
}

export const markUnavailableDate = async (
  payload: MarkUnavailableDatePayload,
): Promise<UnavailableDate> => {
  const response: AxiosResponse<MarkUnavailableDateResponse> = await api.post(
    "/api/unavailable-dates/",
    payload,
  );
  return response.data.date;
};

export const useMarkUnavailableDate = () => {
  const queryClient = useQueryClient();
  return useMutation<UnavailableDate, Error, MarkUnavailableDatePayload>({
    mutationFn: markUnavailableDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
      toast({
        title: "Date marked as unavailable",
        description: "The selected date is now unavailable.",
        variant: "default",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error marking date",
        description: err.message,
        variant: "destructive",
      });
    },
  });
};
