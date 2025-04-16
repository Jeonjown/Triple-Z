// EventStep1.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { EventFormValues } from "../../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import EventCalendar from "./EventCalendar";
import useCheckEventReservationConflict from "../../hooks/useCheckEventReservationConflict";
import useRemainingReservations from "../../hooks/useRemainingReservations";
import { TriangleAlert } from "lucide-react";
import { useGetUnavailableDates } from "../../hooks/useGetUnavailableDates";
import EventTypeDropdown from "./EventTypeDropdown"; // Our custom dropdown

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
    control,
  } = useFormContext<EventFormValues>();

  const dateStr = watch("date");
  const { data: unavailableDatesData } = useGetUnavailableDates();
  const startTime = watch("startTime");

  const selectedDate = dateStr ? new Date(dateStr) : new Date();
  const displayedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  const { conflict, isPending: conflictPending } =
    useCheckEventReservationConflict(selectedDate);
  const remainingReservations = useRemainingReservations(displayedMonth);
  const [errorMsg, setErrorMsg] = useState("");

  // Local state to determine whether to show a free-text input instead of dropdown.
  const [othersSelected, setOthersSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!conflict) {
      setErrorMsg("");
    }
  }, [conflict]);

  useEffect(() => {
    if (dateStr && unavailableDatesData) {
      const selected = new Date(dateStr);
      const isUnavailable = unavailableDatesData.some(
        (item: { date: string }) => {
          const d = new Date(item.date);
          return (
            new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() ===
            new Date(
              selected.getFullYear(),
              selected.getMonth(),
              selected.getDate(),
            ).getTime()
          );
        },
      );
      if (isUnavailable) {
        setErrorMsg(
          "The selected date is unavailable. Please choose another date.",
        );
      } else {
        setErrorMsg("");
      }
    }
  }, [dateStr, unavailableDatesData]);

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
            className={`w-full rounded border p-3 focus:outline-secondary ${fieldError ? "border-red-500 bg-red-200 pr-10" : ""}`}
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

  const handleNextStep = async () => {
    const valid = await trigger([
      "fullName",
      "contactNumber",
      "partySize",
      "date",
      "startTime",
      "eventType",
      "estimatedEventDuration",
    ]);
    if (!valid || conflictPending) return;
    if (conflict) {
      setErrorMsg(
        "The selected date conflicts with an existing reservation. Please choose another date.",
      );
      return;
    }
    if (errorMsg) return;
    if (remainingReservations === 0) {
      setErrorMsg("There are no slots left for the selected month.");
      return;
    }
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
          {renderInputField("contactNumber", "Phone Number", "text")}
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
          <div className="flex-1">
            <Label htmlFor="eventType" className="mb-1 block">
              Event Type
            </Label>
            <Controller
              name="eventType"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <>
                  {!othersSelected ? (
                    <EventTypeDropdown
                      value={field.value}
                      onChange={field.onChange}
                      commonEvents={[
                        "Birthday",
                        "Party",
                        "Wedding",
                        "Meeting",
                        "Conference",
                        "Seminar",
                        "Fundraiser",
                        "Anniversary",
                        "Group Meeting",
                        "Friends Hangout",
                        "Others",
                      ]}
                      onOthersSelect={() => setOthersSelected(true)}
                    />
                  ) : (
                    <div>
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Specify your event type"
                        className="w-full rounded border p-3 focus:outline-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => setOthersSelected(false)}
                        className="mt-1 text-sm text-blue-500"
                      >
                        Choose from list
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="mt-1 flex items-center text-sm text-red-700">
                      <TriangleAlert className="inline h-5 w-5" />
                      <span className="ml-1">{error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </div>

        {/* Calendar & Date Input */}
        <div className="mt-4">
          <EventCalendar />
        </div>

        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex-1">
            <Label htmlFor="date" className="mb-1 block">
              Date
            </Label>
            <div className="relative">
              <Input
                type="date"
                id="date"
                {...register("date")}
                className={`mb-4 w-full rounded border p-3 text-center focus:outline-secondary ${errors.date ? "border-red-500 bg-red-200 pr-10" : ""}`}
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
          {/* Estimated Duration */}
          <div className="mt-4 flex-1">
            <Label htmlFor="estimatedEventDuration" className="mb-1 block">
              Estimated Event Duration (hrs)
            </Label>
            <div className="relative">
              <Input
                id="estimatedEventDuration"
                type="text"
                placeholder="e.g. 2 "
                {...register("estimatedEventDuration", { valueAsNumber: true })}
                className={`w-full rounded border p-3 focus:outline-secondary ${
                  errors.estimatedEventDuration
                    ? "border-red-500 bg-red-200 pr-10"
                    : ""
                }`}
              />
              {errors.estimatedEventDuration && (
                <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
              )}
            </div>
            {errors.estimatedEventDuration && (
              <div className="mt-1 text-sm text-red-700">
                {errors.estimatedEventDuration.message}
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
