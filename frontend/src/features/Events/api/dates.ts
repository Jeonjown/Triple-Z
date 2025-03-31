import axios, { AxiosResponse } from "axios";

// Set the baseURL to your backend server's address.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create an axios instance.
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// --- Types ---
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

interface MarkUnavailableDateResponse {
  message: string;
  date: UnavailableDate;
}

interface UnmarkUnavailableDateResponse {
  message: string;
  date: UnavailableDate;
}

// --- API Request Functions ---

// GET: Retrieve all unavailable dates.
export const getUnavailableDates = async (): Promise<UnavailableDate[]> => {
  try {
    const response: AxiosResponse<GetUnavailableDatesResponse> = await api.get(
      "/api/unavailable-dates/",
    );
    return response.data.dates;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error fetching unavailable dates",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// POST: Mark a date as not available.
export const markDateNotAvailable = async (
  date: string,
  reason: string,
): Promise<UnavailableDate> => {
  try {
    const response: AxiosResponse<MarkUnavailableDateResponse> = await api.post(
      "/api/unavailable-dates/",
      { date, reason },
    );
    return response.data.date;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error marking date as unavailable",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// DELETE: Unmark a date as not available using its ID.
export const unmarkDateNotAvailable = async (
  id: string,
): Promise<UnavailableDate> => {
  try {
    const response: AxiosResponse<UnmarkUnavailableDateResponse> =
      await api.delete(`/api/unavailable-dates/${id}`);
    return response.data.date;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error unmarking date as unavailable",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export default api;
