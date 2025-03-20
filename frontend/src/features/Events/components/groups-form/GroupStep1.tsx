import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import GroupCalendar from "./GroupCalendar";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import { GroupFormValues } from "../../pages/GroupForm";
import TableOccupancyProgress from "../TableOccupancyProgress";
import useGetGroupReservations from "../../hooks/useGetGroupReservations";

export type EventReservationSettings = {
  eventReservationLimit: number;
  eventMinDaysPrior: number;
  eventFee: number;
  eventMinGuests: number;
  groupReservationLimit: number;
  groupMinDaysPrior: number;
  groupMinReservation: number;
  groupMaxReservation: number;
  groupMaxTablesPerDay: number;
  groupMaxGuestsPerTable: number;
  openingHours: string;
  closingHours: string;
};

type Step1Props = {
  nextStep: () => void;
  minReservation: number;
  maxReservation: number;
  settings?: EventReservationSettings;
};

const GroupStep1 = ({
  nextStep,
  minReservation,
  maxReservation,
  settings,
}: Step1Props) => {
  const {
    setValue,
    register,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<GroupFormValues>();

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const partySize = watch("partySize");
  const dateInput = watch("date"); // Date entered by the user

  const maxGuestsPerTable = settings?.groupMaxGuestsPerTable || 6;
  const totalTables = settings?.groupMaxTablesPerDay ?? 0;
  const tablesOccupied = partySize
    ? Math.ceil(partySize / maxGuestsPerTable)
    : 0;

  // State to store available tables computed solely from the date input.
  const [inputAvailableTables, setInputAvailableTables] = useState<
    number | null
  >(null);
  // Error message if the input date is fully booked.
  const [fullyBookedError, setFullyBookedError] = useState<string | null>(null);

  const { data: reservations } = useGetGroupReservations();
  const { data: settingsData } = useGetEventReservationSettings();

  useEffect(() => {
    if (dateInput && reservations && settingsData) {
      const d = new Date(dateInput);
      if (!isNaN(d.getTime())) {
        // Define start and end of the selected day.
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const endOfDay = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate() + 1,
        );
        // Filter reservations for that day.
        const reservationsForDay = reservations.filter(
          (r: { date: string; partySize: number }) => {
            const resDate = new Date(r.date);
            return resDate >= startOfDay && resDate < endOfDay;
          },
        );
        // Sum tables required by all reservations (using same logic as in the calendar).
        const totalBookedTables = reservationsForDay.reduce((sum, r) => {
          return (
            sum + Math.ceil(r.partySize / settingsData.groupMaxGuestsPerTable)
          );
        }, 0);
        // Compute available tables.
        const available = settingsData.groupMaxTablesPerDay - totalBookedTables;
        setInputAvailableTables(available);
        if (available === 0) {
          setFullyBookedError(
            "The date you picked is fully booked. Please choose another date.",
          );
        } else {
          setFullyBookedError(null);
        }
      } else {
        setInputAvailableTables(null);
        setFullyBookedError(null);
      }
    }
  }, [dateInput, reservations, settingsData]);

  const handleNextStep = async () => {
    const valid = await trigger([
      "fullName",
      "contactNumber",
      "partySize",
      "date",
      "startTime",
      "endTime",
    ]);
    // Prevent moving to the next step if available tables are 0.
    if (inputAvailableTables === 0) {
      setFullyBookedError(
        "The date you picked is fully booked. Please choose another date.",
      );
      return;
    }
    if (valid) {
      nextStep();
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-10 lg:flex lg:space-x-2">
        <div className="flex-1">
          <Label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            className={`mb-4 mt-1 w-full ${errors.fullName ? "border-red-500" : ""}`}
          />
          {errors.fullName && (
            <div className="text-xs text-red-700">
              {typeof errors.fullName.message === "string"
                ? errors.fullName.message
                : ""}
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            {...register("contactNumber")}
            className={`mb-4 mt-1 w-full ${errors.contactNumber ? "border-red-500" : ""}`}
          />
          {errors.contactNumber && (
            <div className="text-xs text-red-700">
              {typeof errors.contactNumber.message === "string"
                ? errors.contactNumber.message
                : ""}
            </div>
          )}
        </div>
      </div>
      <div className="lg:flex lg:space-x-2">
        <div className="flex-1">
          <Label
            htmlFor="partySize"
            className="block text-sm font-medium text-gray-700"
          >
            Party Size
          </Label>
          <Input
            type="number"
            id="partySize"
            min={minReservation}
            max={maxReservation}
            placeholder={`Allowed: ${minReservation} to ${maxReservation}`}
            {...register("partySize")}
            className={`mt-1 w-full ${errors.partySize ? "border-red-500" : ""}`}
          />
          {errors.partySize && (
            <div className="mt-2 text-xs text-red-700">
              {typeof errors.partySize.message === "string"
                ? errors.partySize.message
                : ""}
            </div>
          )}
          <div className="mt-4 rounded-md bg-gray-50 p-4 shadow">
            <ul className="list-disc space-y-1 pl-5 text-sm text-primary">
              <TableOccupancyProgress
                tablesOccupied={tablesOccupied}
                totalTables={totalTables}
              />
              <li>
                <span className="font-medium">Each table can accommodate:</span>{" "}
                {maxGuestsPerTable} guests.
              </li>
              <li>
                <span className="font-medium">
                  Allowed guests per reservation:
                </span>{" "}
                {minReservation} to {maxReservation}.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Calendar for visual feedback only */}
      <GroupCalendar />
      <div className="mt-6">
        <Label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </Label>
        <Input
          type="date"
          id="date"
          {...register("date")}
          className={`mb-4 mt-1 w-full ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && (
          <div className="text-xs text-red-700">
            {typeof errors.date.message === "string" ? errors.date.message : ""}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </Label>
          <HourlyTimePicker
            value={startTime}
            onChange={(time) => setValue("startTime", time)}
          />
          {errors.startTime && (
            <div className="text-xs text-red-700">
              {typeof errors.startTime.message === "string"
                ? errors.startTime.message
                : ""}
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </Label>
          <HourlyTimePicker
            value={endTime}
            onChange={(time) => setValue("endTime", time)}
          />
          {errors.endTime && (
            <div className="text-xs text-red-700">
              {typeof errors.endTime.message === "string"
                ? errors.endTime.message
                : ""}
            </div>
          )}
        </div>
      </div>
      <Button
        type="button"
        onClick={handleNextStep}
        className={`mt-10 ${inputAvailableTables === 0 ? "cursor-not-allowed bg-gray-300" : ""}`}
        disabled={inputAvailableTables === 0}
      >
        Next
      </Button>
      {fullyBookedError && (
        <p className="mt-2 text-center text-xs text-red-500">
          {fullyBookedError}
        </p>
      )}
    </>
  );
};

export default GroupStep1;
