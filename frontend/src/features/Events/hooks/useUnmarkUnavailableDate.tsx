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

interface UnmarkUnavailableDateResponse {
  message: string;
  date: UnavailableDate;
}

export const unmarkUnavailableDate = async (
  id: string,
): Promise<UnavailableDate> => {
  const response: AxiosResponse<UnmarkUnavailableDateResponse> =
    await api.delete(`/api/unavailable-dates/${id}`);
  return response.data.date;
};

export const useUnmarkUnavailableDate = () => {
  const queryClient = useQueryClient();
  return useMutation<UnavailableDate, Error, string>({
    mutationFn: unmarkUnavailableDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
      toast({
        title: "Date unmarked successfully",
        description: "The date is now available.",
        variant: "default",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error unmarking date",
        description: err.message,
        variant: "destructive",
      });
    },
  });
};
