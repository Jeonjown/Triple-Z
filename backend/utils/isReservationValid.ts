import { EventReservation } from "../models/eventReservationModel";

export const isReservationDateValid = async (
  date: Date | string
): Promise<{ isValid: boolean; message?: string }> => {
  const reservationDate = new Date(date);
  const now = new Date();

  // Calculate the minimum valid date (today + 14 days)
  const minValidDate = new Date();
  minValidDate.setDate(now.getDate() + 14);

  // Check if the provided reservation date is on or after the minimum valid date
  if (reservationDate < minValidDate) {
    return {
      isValid: false,
      message: "Reservations must be made at least 14 days in advance.",
    };
  }

  // Calculate the start and end of the month for this reservation date
  const startOfMonth = new Date(
    reservationDate.getFullYear(),
    reservationDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    reservationDate.getFullYear(),
    reservationDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Count the number of reservations in the same month (for all users)
  const reservationsCount = await EventReservation.countDocuments({
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Ensure the total reservations in the month are fewer than 2
  if (reservationsCount >= 2) {
    return {
      isValid: false,
      message: "Only 2 reservations are allowed per month.",
    };
  }

  // Check if there are any existing reservations on the exact same date
  const existingReservation = await EventReservation.findOne({
    date: reservationDate,
  });

  // If there's already a reservation on the exact same date, it's considered an overlap
  if (existingReservation) {
    return { isValid: false, message: "This date has already been reserved." };
  }

  return { isValid: true };
};
