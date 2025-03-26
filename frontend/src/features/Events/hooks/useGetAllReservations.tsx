// src/hooks/useGetAllReservations.ts
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Reservation {
  _id: string;
  userId: string; // Simplified as string for this hook; ensure consistency with your backend.
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  cart: CartItem[];
  eventStatus: string;
  createdAt: string;
  specialRequest: string;
  totalPayment: number;
  eventFee: number;
  subtotal: number;
  paymentStatus: string;
  isCorkage: boolean;
  reservationType: string;
  __v: number;
}

interface AllReservationsResponse {
  message: string;
  reservations: Reservation[];
}

export const getAllReservations =
  async (): Promise<AllReservationsResponse> => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response: AxiosResponse<AllReservationsResponse> = await axios.get(
      `${baseURL}/api/events/event-reservations/all`,
      { withCredentials: true },
    );
    return response.data;
  };

export const useGetAllReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: getAllReservations,
  });
};
