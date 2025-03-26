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
  eventReservationLimit: number;
  eventMinDaysPrior: number;
  eventFee: number;
  eventMinGuests: number;
  eventTermsofService: string;
  eventMinPackageOrder: number;
  eventCorkageFee: number;
  groupReservationLimit: number;
  groupMinDaysPrior: number;
  groupMaxTablesPerDay: number;
  groupMaxGuestsPerTable: number;
  groupMinGuestPerTable: number;
  groupMinReservation: number;
  groupMaxReservation: number;
  openingHours: string;
  closingHours: string;
  createdAt: string;
  updatedAt: string;
}

interface EventReservationSettingsResponse {
  success: boolean;
  data: EventReservationSettings;
}

export interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Reservation {
  _id: string;
  userId: string;
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
  __v: number;
}

interface UserReservation {
  _id: string;
  username: string;
  email: string;
}

interface ReservationError {
  success: boolean;
  message: string;
}

export interface Reservation {
  message: string;
  reservation: {
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
  };
}

interface ReservationError {
  error: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export const createEventReservation = async (
  eventFormValues: EventFormValues,
  userId: string,
): Promise<Reservation> => {
  try {
    console.log("from request:", eventFormValues);
    const response: AxiosResponse<Reservation> = await api.post(
      `/api/events/event-reservations/${userId}`,
      eventFormValues,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An error occurred",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getEventReservations = async () => {
  try {
    const response = await api.get("/api/events/event-reservations");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateEventReservationStatus = async (
  eventStatus: string,
  reservationId: string,
) => {
  try {
    const response: AxiosResponse<string> = await api.patch(
      `/api/events/event-reservations/event-status`,
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

export const updateEventReservationPaymentStatus = async (
  paymentStatus: string,
  reservationId: string,
) => {
  try {
    const response: AxiosResponse<string> = await api.patch(
      `/api/events/event-reservations/payment-status`,
      {
        paymentStatus,
        reservationId,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ReservationError>;
      console.log(error);
      throw new Error(axiosError.response?.data?.error || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteEventReservation = async (reservationId: string) => {
  try {
    const response: AxiosResponse<string> = await api.delete(
      `/api/events/event-reservations/`,
      { data: { reservationId } },
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

export const getEventReservationSettings =
  async (): Promise<EventReservationSettings> => {
    try {
      const response: AxiosResponse<EventReservationSettingsResponse> =
        await api.get(`/api/events/settings`);
      return response.data.data;
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

export const createOrUpdateEventSettings = async (
  settings: Partial<EventReservationSettings>,
): Promise<EventReservationSettings> => {
  try {
    const response: AxiosResponse<EventReservationSettingsResponse> =
      await api.post(`/api/events/settings`, settings);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ReservationError>;
      throw new Error(axiosError.response?.data?.error || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const adminRescheduleEventReservation = async (updateData: {
  reservationId: string;
  date: string;
  startTime: string;
  endTime: string;
}): Promise<Reservation> => {
  try {
    // Use a leading slash so the URL is absolute relative to the baseURL.
    const response: AxiosResponse<Reservation> = await api.patch(
      `/api/events/event-reservations/reschedule`,
      updateData,
      { withCredentials: true }, // if needed
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message: string;
        error?: string;
      }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An error occurred",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
