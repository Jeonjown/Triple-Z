import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

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

interface GetUnavailableDatesResponse {
  message: string;
  dates: UnavailableDate[];
}

export const getUnavailableDates = async (): Promise<UnavailableDate[]> => {
  const response: AxiosResponse<GetUnavailableDatesResponse> = await api.get(
    "/api/unavailable-dates/",
  );
  return response.data.dates;
};

export const useGetUnavailableDates = () => {
  return useQuery<UnavailableDate[]>({
    queryKey: ["unavailableDates"],
    queryFn: getUnavailableDates,
  });
};
