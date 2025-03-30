// // GroupRescheduleReservationDialog.tsx
// import React, { useState } from "react";
// import { format, parseISO } from "date-fns";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import HourlyTimePicker from "@/features/Events/components/events-form/HourlyTimePicker";
// import { GroupReservation } from "./columns";

// interface GroupRescheduleReservationDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   reservation: GroupReservation;
// }

// const GroupRescheduleReservationDialog: React.FC<
//   GroupRescheduleReservationDialogProps
// > = ({ open, onOpenChange, reservation }) => {
//   const formattedDate = format(parseISO(reservation.date), "yyyy-MM-dd");
//   const [formData, setFormData] = useState({
//     date: formattedDate,
//     startTime: reservation.startTime,
//     endTime: reservation.endTime,
//   });
//   const { mutate, isPending } = useRescheduleGroupReservation();

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     setFormData({ ...formData, date: e.target.value });
//   };

//   const handleStartTimeChange = (time: string): void => {
//     setFormData({ ...formData, startTime: time });
//   };

//   const handleEndTimeChange = (time: string): void => {
//     setFormData({ ...formData, endTime: time });
//   };

//   const handleSubmit = (e: React.FormEvent): void => {
//     e.preventDefault();
//     mutate({
//       userId: reservation.userId._id,
//       updateData: {
//         reservationId: reservation._id,
//         date: formData.date,
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//       },
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Reschedule Reservation</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleDateChange}
//               className="mt-1 block w-full rounded border p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Start Time</label>
//             <HourlyTimePicker
//               id="start-time"
//               value={formData.startTime}
//               onChange={handleStartTimeChange}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">End Time</label>
//             <HourlyTimePicker
//               id="end-time"
//               value={formData.endTime}
//               onChange={handleEndTimeChange}
//             />
//           </div>
//           <div className="flex justify-end">
//             <Button type="submit" disabled={isPending}>
//               {isPending ? "Rescheduling..." : "Reschedule Reservation"}
//             </Button>
//           </div>
//         </form>
//         <DialogClose className="absolute right-4 top-4" />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GroupRescheduleReservationDialog;
