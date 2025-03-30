// groupReservationAPI.ts
import axios, { AxiosError, AxiosResponse } from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

interface ReservationError {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface GroupReservation {
  message: string;
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  fullName: string;
  contactNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  cart: Array<{
    _id: string;
    title: string;
    quantity: number;
    totalPrice: number;
    image: string;
  }>;
  eventStatus: string;
  paymentStatus: string;
  subtotal: number;
  totalPayment: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GroupReservationFormValues {
  date: string;
  fullName: string;
  contactNumber: string;
  startTime: string;
  endTime: string;
  partySize: number;
  cart: Array<{
    _id: string;
    title: string;
    quantity: number;
    totalPrice: number;
    image: string;
  }>;
}

// Create a group reservation
export const createGroupReservation = async (
  groupFormValues: GroupReservationFormValues,
  userId: string,
): Promise<GroupReservation> => {
  try {
    const response: AxiosResponse<GroupReservation> = await api.post(
      `/api/events/group-reservations/${userId}`,
      groupFormValues,
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

// Get all group reservations
export const getGroupReservations = async (): Promise<GroupReservation[]> => {
  try {
    const response: AxiosResponse = await api.get(
      "/api/events/group-reservations/",
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ReservationError>;
      throw new Error(
        axiosError.response?.data?.message || "An error occurred",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Update group reservation status
export const updateGroupReservationStatus = async (
  eventStatus: string,
  reservationId: string,
): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await api.patch(
      `/api/events/group-reservations/event-status`,
      { eventStatus, reservationId },
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

// Update group reservation payment status
export const updateGroupReservationPaymentStatus = async (
  paymentStatus: string,
  reservationId: string,
): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await api.patch(
      `/api/events/group-reservations/payment-status`,
      { paymentStatus, reservationId },
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

// Delete a group reservation
export const deleteGroupReservation = async (
  reservationId: string,
): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await api.delete(
      `/api/events/group-reservations/`,
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

export interface RescheduleGroupReservationData {
  reservationId: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Mutation function for rescheduling a group reservation.
export const adminRescheduleGroupReservation = async (
  updateData: RescheduleGroupReservationData,
): Promise<GroupReservation> => {
  try {
    // Call the PATCH endpoint for group reservation reschedule.
    const response: AxiosResponse<GroupReservation> = await api.patch(
      `/api/events/group-reservations/group-reschedule`,
      updateData,
      { withCredentials: true }, // Include credentials if needed.
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
