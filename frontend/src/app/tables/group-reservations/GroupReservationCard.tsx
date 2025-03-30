// GroupReservationCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import { GroupReservation } from "./columns";
import PaymentStatusCell from "./PaymentStatusCell";
import EventStatusCell from "./EventStatusCell";
import GroupViewCart from "./GroupViewCart";

interface GroupReservationCardProps {
  reservation: GroupReservation;
}

const GroupReservationCard: React.FC<GroupReservationCardProps> = ({
  reservation,
}) => {
  const createdDate = formatDate(new Date(reservation.createdAt), "MM-dd-yyyy");
  const createdTime = formatDate(new Date(reservation.createdAt), "h:mm a");
  const eventDate = formatDate(new Date(reservation.date), "MM-dd-yyyy");

  return (
    <Card className="w-full shadow transition hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-4">
        {/* Header: Reservation ID and Cart */}
        <div className="flex items-center justify-between">
          <span className="text-xs">{reservation._id}</span>
          <span className="ml-auto text-right">
            <GroupViewCart reservation={reservation} />
          </span>
        </div>
        <FaUserCircle size={96} className="mx-auto mt-2 text-primary" />
        {/* Main details */}
        <div className="mx-auto text-center text-2xl font-semibold">
          {reservation.fullName}
        </div>
        <div className="mx-auto text-center text-lg">
          {reservation.contactNumber}
        </div>
        <div className="mx-auto text-center">
          {reservation.userId.email || "N/A"}
        </div>
        {/* New grid row: User ID */}
        <div className="mt-2 grid grid-cols-2 gap-x-2">
          <span className="font-medium">User ID:</span>
          <span className="text-right">{reservation.userId._id}</span>
        </div>
        {/* Additional details */}
        <div className="mb-10 mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-x-2">
            <span className="font-medium">Party Size:</span>
            <span className="text-right">{reservation.partySize}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <span className="font-medium">Date:</span>
            <span className="text-right">
              {eventDate}
              <br />
              <span className="text-xs text-gray-500">
                {reservation.startTime} - {reservation.endTime}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <span className="font-medium">Created At:</span>
            <span className="text-right">
              {createdDate}
              <br />
              <span className="text-xs text-gray-500">{createdTime}</span>
            </span>
          </div>
        </div>
        {/* Footer: Status and Payment cells */}
        <div className="mt-auto flex justify-between">
          <div className="text-center">
            <p className="text-xs text-gray-500">Status:</p>
            <EventStatusCell reservation={reservation} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Payment:</p>
            <PaymentStatusCell reservation={reservation} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupReservationCard;
