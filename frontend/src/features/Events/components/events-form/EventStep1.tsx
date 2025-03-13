import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "../../pages/EventForm";
import { useFormContext } from "react-hook-form";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import EventCalendar from "./EventCalendar";
import useCheckEventReservationConflict from "../../hooks/useCheckEventReservationConflict";
import useRemainingReservations from "../../hooks/useRemainingReservations";

type Step1Props = {
  nextStep: () => void;
  minGuests: number;
};

const EventStep1: React.FC<Step1Props> = ({ nextStep, minGuests }) => {
  const {
    setValue,
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<EventFormValues>();

  // Watch form fields
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const dateStr = watch("date"); // expecting format "YYYY-MM-DD"

  // Convert date string to Date (if empty, fallback to current date)
  const selectedDate = dateStr ? new Date(dateStr) : new Date();

  // Normalize the selected date to the first day of its month
  const displayedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  // Check for date conflicts
  const { conflict, isPending: conflictPending } =
    useCheckEventReservationConflict(selectedDate);

  // Get remaining slots for the displayed month from custom hook
  const remainingReservations = useRemainingReservations(displayedMonth);

  // Local state for error messages (e.g. date conflict or no slots)
  const [errorMsg, setErrorMsg] = useState("");

  const handleNextStep = async () => {
    // Validate required fields first
    const valid = await trigger([
      "fullName",
      "contactNumber",
      "partySize",
      "date",
      "startTime",
      "endTime",
      "eventType",
    ]);
    if (!valid) return;
    if (conflictPending) return;

    // Check date conflict
    if (conflict) {
      setErrorMsg(
        "The selected date conflicts with an existing reservation. Please choose another date.",
      );
      return;
    } else {
      setErrorMsg("");
    }

    // If no slots are left, set error message and stop
    if (remainingReservations === 0) {
      setErrorMsg("There are no slots left for the selected month.");
      return;
    }

    // Clear error message and proceed if everything is valid
    setErrorMsg("");
    nextStep();
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-10 px-4">
        {/* Full Name & Contact Number */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="fullName" className="mb-1 block">
              Full Name
            </Label>
            <Input
              type="text"
              id="fullName"
              {...register("fullName")}
              className={`w-full rounded border p-3 focus:outline-secondary ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <div className="text-xs text-red-700">
                {errors.fullName.message}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="contactNumber" className="mb-1 block">
              Contact Number
            </Label>
            <Input
              type="text"
              id="contactNumber"
              {...register("contactNumber")}
              className={`w-full rounded border p-3 focus:outline-secondary ${
                errors.contactNumber ? "border-red-500" : ""
              }`}
            />
            {errors.contactNumber && (
              <div className="text-xs text-red-700">
                {errors.contactNumber.message}
              </div>
            )}
          </div>
        </div>

        {/* Party Size & Event Type */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="partySize" className="mb-1 block">
              Party Size
            </Label>
            <Input
              type="number"
              id="partySize"
              min={minGuests}
              placeholder={`Minimum of ${minGuests}`}
              {...register("partySize")}
              className={`w-full rounded border p-3 focus:outline-secondary ${
                errors.partySize ? "border-red-500" : ""
              }`}
            />
            {errors.partySize && (
              <div className="text-xs text-red-700">
                {errors.partySize.message}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="eventType" className="mb-1 block">
              Event Type
            </Label>
            <Input
              type="text"
              id="eventType"
              placeholder="Ex. Birthday, Party"
              {...register("eventType")}
              className={`w-full rounded border p-3 focus:outline-secondary ${
                errors.eventType ? "border-red-500" : ""
              }`}
            />
            {errors.eventType && (
              <div className="text-xs text-red-700">
                {errors.eventType.message}
              </div>
            )}
          </div>
        </div>

        {/* Calendar & Date Input */}
        <div className="mt-4">
          <EventCalendar />
        </div>
        <div>
          <Label htmlFor="date" className="mb-1 block">
            Date
          </Label>
          <Input
            type="date"
            id="date"
            {...register("date")}
            className={`mb-4 w-full rounded border p-3 text-center focus:outline-secondary ${
              errors.date ? "border-red-500" : ""
            }`}
          />
          {errors.date && (
            <div className="text-xs text-red-700">
              {typeof errors.date.message === "string"
                ? errors.date.message
                : ""}
            </div>
          )}
          {errorMsg && <div className="text-xs text-red-700">{errorMsg}</div>}
        </div>

        {/* Time Pickers */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="startTime" className="mb-1 block">
              Start Time
            </Label>
            <HourlyTimePicker
              id="startTime"
              value={startTime}
              onChange={(time) => setValue("startTime", time)}
            />
            {errors.startTime && (
              <div className="text-xs text-red-700">
                {errors.startTime.message}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="endTime" className="mb-1 block">
              End Time
            </Label>
            <HourlyTimePicker
              id="endTime"
              value={endTime}
              onChange={(time) => setValue("endTime", time)}
            />
            {errors.endTime && (
              <div className="text-xs text-red-700">
                {errors.endTime.message}
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-10 text-center">
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full"
            disabled={remainingReservations === 0}
          >
            Next
          </Button>
          {remainingReservations === 0 && (
            <p className="mt-2 text-xs text-red-700">
              There are no slots left for the selected month.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default EventStep1;
