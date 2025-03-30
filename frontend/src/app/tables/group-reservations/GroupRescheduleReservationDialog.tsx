// GroupRescheduleReservationDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parse, format } from "date-fns";
import { GroupReservation } from "./columns";
import { useRescheduleGroupReservation } from "@/features/Events/hooks/useRescheduleGroupReservation";

const GroupRescheduleReservationDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: GroupReservation;
}> = ({ open, onOpenChange, reservation }) => {
  // Convert stored time to 24-hour format for the time inputs.
  const initialStartTime =
    reservation.startTime.toLowerCase().includes("am") ||
    reservation.startTime.toLowerCase().includes("pm")
      ? format(parse(reservation.startTime, "h:mm a", new Date()), "HH:mm")
      : reservation.startTime;
  const initialEndTime =
    reservation.endTime.toLowerCase().includes("am") ||
    reservation.endTime.toLowerCase().includes("pm")
      ? format(parse(reservation.endTime, "h:mm a", new Date()), "HH:mm")
      : reservation.endTime;

  // Pre-fill form state with the reservation's current scheduling values.
  const [formData, setFormData] = useState({
    date: reservation.date.slice(0, 10), // "YYYY-MM-DD"
    startTime: initialStartTime,
    endTime: initialEndTime,
  });

  const { mutate, isPending } = useRescheduleGroupReservation();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, startTime: e.target.value });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, endTime: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert 24-hour times back to 12-hour (with AM/PM) before sending.
    const convertedStartTime = format(
      parse(formData.startTime, "HH:mm", new Date()),
      "h:mm a",
    );
    const convertedEndTime = format(
      parse(formData.endTime, "HH:mm", new Date()),
      "h:mm a",
    );

    mutate({
      userId: reservation.userId._id,
      updateData: {
        reservationId: reservation._id,
        date: formData.date,
        startTime: convertedStartTime,
        endTime: convertedEndTime,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Group Reservation</DialogTitle>
          <DialogDescription>
            Update the date and time for this group reservation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleStartTimeChange}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleEndTimeChange}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Rescheduling..." : "Reschedule Reservation"}
            </Button>
          </DialogFooter>
        </form>
        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
};

export default GroupRescheduleReservationDialog;
