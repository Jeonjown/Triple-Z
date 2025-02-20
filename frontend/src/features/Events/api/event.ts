import axios, { AxiosError, AxiosResponse } from "axios";
import { EventFormValues } from "../pages/EventForm";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export interface EventReservationSettings {
  _id: string;
  __v: number;
  closingHours: string;
  createdAt: string;
  eventReservationLimit: number;
  groupReservationLimit: number;
  minDaysPrior: number;
  minGuests: number;
  maxTables: number;
  openingHours: string;
  updatedAt: string;
  eventFee: number;
}

interface EventReservationSettingsResponse {
  success: boolean;
  data: EventReservationSettings;
}

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
  specialRequest?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface ReservationError {
  error: string;
}

export const createReservation = async (
  eventFormValues: EventFormValues,
  userId: string,
): Promise<Reservation> => {
  try {
    console.log("from request:", eventFormValues);
    // Make POST request and specify the response type as Reservation
    const response: AxiosResponse<Reservation> = await api.post(
      `/api/menu/events/reservations/${userId}`,
      eventFormValues,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ReservationError>;
      throw new Error(axiosError.response?.data?.error || "An error occurred");
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

export const updateReservationStatus = async (
  eventStatus: string,
  reservationId: string,
) => {
  try {
    const response: AxiosResponse<string> = await api.patch(
      `/api/menu/events/reservations/status`,
      {
        eventStatus,
        reservationId,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ReservationError>;
      throw new Error(axiosError.response?.data?.error || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

//EVENT RESERVATIONS SETTINGS
export const getEventReservationSettings =
  async (): Promise<EventReservationSettings> => {
    try {
      const response: AxiosResponse<EventReservationSettingsResponse> =
        await api.get(`/api/menu/events/settings`);

      return response.data.data; // ✅ Ensure we return the nested 'data' object
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ReservationError>;
        throw new Error(
          axiosError.response?.data?.error || "An error occurred",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  };
