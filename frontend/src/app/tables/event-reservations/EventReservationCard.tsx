// EventReservationsCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Reservation } from "./columns";
import ViewCart from "./ViewCart";
import EventStatusCell from "./EventStatusCell";
import PaymentStatusCell from "./PaymentStatusCell";
import { formatDate } from "date-fns";
import { Table } from "@tanstack/react-table";
import { FaUserCircle } from "react-icons/fa";

interface EventReservationsCardProps {
  reservations: Reservation[];
  table: Table<Reservation>;
}

const EventReservationsCard: React.FC<EventReservationsCardProps> = ({
  reservations,
  table,
}) => {
  // Extract column visibility state from the table
  const { columnVisibility } = table.getState();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reservations.map((reservation) => {
        const createdDate = formatDate(
          new Date(reservation.createdAt),
          "MM-dd-yyyy",
        );
        const createdTime = formatDate(
          new Date(reservation.createdAt),
          "h:mm a",
        );
        const eventDate = formatDate(new Date(reservation.date), "MM-dd-yyyy");

        return (
          <Card
            key={reservation._id}
            className="w-full shadow transition hover:shadow-lg"
          >
            <CardContent className="flex h-full flex-col p-4">
              <div className="flex items-center justify-between">
                {columnVisibility["_id"] !== false && (
                  <span className="text-xs">{reservation._id}</span>
                )}
                {columnVisibility["actions"] !== false && (
                  <span className="ml-auto text-right">
                    <ViewCart reservation={reservation} />
                  </span>
                )}
              </div>

              <FaUserCircle size={96} className="mx-auto mt-2 text-primary" />

              {columnVisibility["fullName"] !== false && (
                <div className="mx-auto text-center text-2xl font-semibold">
                  {reservation.fullName}
                </div>
              )}
              {columnVisibility["contactNumber"] !== false && (
                <div className="mx-auto text-center text-lg">
                  {reservation.contactNumber}
                </div>
              )}
              {columnVisibility["email"] !== false && (
                <div className="mx-auto text-center">
                  {reservation.userId?.email || "N/A"}
                </div>
              )}
              {columnVisibility["userId"] !== false && (
                <span className="text-center text-xs">
                  {reservation.userId?._id || "N/A"}
                </span>
              )}

              <div className="mb-10 mt-8 space-y-4">
                {columnVisibility["partySize"] !== false && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Party Size:</span>
                    <span className="text-right">{reservation.partySize}</span>
                  </div>
                )}
                {columnVisibility["totalPayment"] !== false && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Total Payment:</span>
                    <span className="text-right">
                      ₱{reservation.totalPayment.toLocaleString()}
                    </span>
                  </div>
                )}
                {columnVisibility["dateTime"] !== false && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Date & Time:</span>
                    <span className="text-right">
                      {eventDate}
                      <br />
                      <span className="text-right text-xs text-gray-500">
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </span>
                  </div>
                )}

                {columnVisibility["createdAt"] !== false && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Created At:</span>
                    <span className="text-right">
                      {createdDate}
                      <br />
                      <span className="text-xs text-gray-500">
                        {createdTime}
                      </span>
                    </span>
                  </div>
                )}
                {columnVisibility["specialRequest"] !== false && (
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Special Request:</span>
                    <span className="text-right">
                      {reservation.specialRequest}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom status section, always pushed to the bottom */}
              <div className="mt-auto flex justify-between">
                {columnVisibility["eventStatus"] !== false && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Event Status:</p>
                    <EventStatusCell reservation={reservation} />
                  </div>
                )}
                {columnVisibility["paymentStatus"] !== false && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Payment Status:</p>
                    <PaymentStatusCell reservation={reservation} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EventReservationsCard;
