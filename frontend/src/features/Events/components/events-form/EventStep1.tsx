// EventStep1.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import EventCalendar from "./EventCalendar";
import useCheckEventReservationConflict from "../../hooks/useCheckEventReservationConflict";
import useRemainingReservations from "../../hooks/useRemainingReservations";
import { TriangleAlert } from "lucide-react";

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

  // Watch the date field from the form
  const dateStr = watch("date");

  // Get start and end times from form
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Parse the selected date or fallback to current date
  const selectedDate = dateStr ? new Date(dateStr) : new Date();
  const displayedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  // Check if the selected date has a conflict using a custom hook
  const { conflict, isPending: conflictPending } =
    useCheckEventReservationConflict(selectedDate);
  const remainingReservations = useRemainingReservations(displayedMonth);

  // Local state for error message
  const [errorMsg, setErrorMsg] = useState("");

  // Clear error only when conflict becomes false
  useEffect(() => {
    if (!conflict) {
      setErrorMsg("");
    }
  }, [conflict]);

  // Helper function to render an input field with realtime validation
  const renderInputField = (
    id: string,
    label: string,
    type: string,
    placeholder?: string,
    extraProps = {},
  ) => {
    const fieldError = errors[id as keyof EventFormValues]?.message as
      | string
      | undefined;
    return (
      <div className="flex-1">
        <Label htmlFor={id} className="mb-1 block">
          {label}
        </Label>
        <div className="relative">
          <Input
            type={type}
            id={id}
            placeholder={placeholder}
            {...register(id as keyof EventFormValues)}
            className={`w-full rounded border p-3 focus:outline-secondary ${
              fieldError ? "border-red-500 bg-red-200 pr-10" : ""
            }`}
            {...extraProps}
          />
          {fieldError && (
            <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
          )}
        </div>
        {fieldError && (
          <div className="mt-1 text-sm text-red-700">{fieldError}</div>
        )}
      </div>
    );
  };

  // Handle moving to the next step, ensuring validations and no conflicts
  const handleNextStep = async () => {
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

    // If conflict exists, show error and do not proceed
    if (conflict) {
      setErrorMsg(
        "The selected date conflicts with an existing reservation. Please choose another date.",
      );
      return;
    }

    // If no slots remain, show error and do not proceed
    if (remainingReservations === 0) {
      setErrorMsg("There are no slots left for the selected month.");
      return;
    }

    // Clear any error and move to the next step
    setErrorMsg("");
    nextStep();
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-10 px-4">
        {/* Full Name & Contact Number */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          {renderInputField("fullName", "Full Name", "text")}
          {renderInputField("contactNumber", "Contact Number", "text")}
        </div>

        {/* Party Size & Event Type */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          {renderInputField(
            "partySize",
            "Person(s)",
            "number",
            `Minimum of ${minGuests}`,
            { min: minGuests },
          )}
          {renderInputField(
            "eventType",
            "Event Type",
            "text",
            "Ex. Birthday, Party",
          )}
        </div>

        {/* Calendar & Date Input */}
        <div className="mt-4">
          <EventCalendar />
        </div>
        <div className="mt-4">
          <Label htmlFor="date" className="mb-1 block">
            Date
          </Label>
          <div className="relative">
            <Input
              type="date"
              id="date"
              {...register("date")}
              className={`mb-4 w-full rounded border p-3 text-center focus:outline-secondary ${
                errors.date ? "border-red-500 bg-red-200 pr-10" : ""
              }`}
            />
            {errors.date && (
              <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
            )}
          </div>
          {errors.date && (
            <div className="mt-1 text-sm text-red-700">
              {typeof errors.date.message === "string"
                ? errors.date.message
                : ""}
            </div>
          )}
          {errorMsg && (
            <div className="mt-2 flex items-center text-sm text-red-700">
              <TriangleAlert className="mr-1 h-5 w-5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Time Pickers */}
        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="startTime" className="mb-1 block">
              Start Time
            </Label>
            <div className="relative">
              <HourlyTimePicker
                id="startTime"
                value={startTime}
                onChange={(time) => setValue("startTime", time)}
              />
              {errors.startTime && (
                <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
              )}
            </div>
            {errors.startTime && (
              <div className="mt-1 text-sm text-red-700">
                {errors.startTime.message}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="endTime" className="mb-1 block">
              End Time
            </Label>
            <div className="relative">
              <HourlyTimePicker
                id="endTime"
                value={endTime}
                onChange={(time) => setValue("endTime", time)}
              />
              {errors.endTime && (
                <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
              )}
            </div>
            {errors.endTime && (
              <div className="mt-1 text-sm text-red-700">
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
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={remainingReservations === 0}
          >
            Next
          </Button>
          {remainingReservations === 0 && (
            <div className="mt-2 flex items-center text-sm text-red-700">
              <TriangleAlert className="mr-1 h-5 w-5" />
              <span>There are no slots left for the selected month.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventStep1;
