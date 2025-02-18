import axios from "axios";
import { EventFormValues } from "../pages/EventForm";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

interface UserReservation {
  _id: string;
  username: string;
  email: string;
}

export interface Reservation {
  _id: string;
  user: UserReservation;
  fullName: string;
  contactNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  partySize: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const createReservation = async (
  eventFormValues: EventFormValues,
  userId: string,
) => {
  try {
    console.log("from request:", eventFormValues);
    const response = await api.post(
      `/api/menu/events/reservations/${userId}`,
      eventFormValues,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getReservations = async () => {
  try {
    const response = await api.get("/api/menu/events/reservations");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
