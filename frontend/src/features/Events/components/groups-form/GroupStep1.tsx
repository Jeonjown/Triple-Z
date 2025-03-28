// GroupStep1.tsx
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
import { TriangleAlert } from "lucide-react";

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
  const dateInput = watch("date");

  const maxGuestsPerTable = settings?.groupMaxGuestsPerTable || 6;
  const totalTables = settings?.groupMaxTablesPerDay ?? 0;
  const tablesOccupied = partySize
    ? Math.ceil(partySize / maxGuestsPerTable)
    : 0;

  // State for available tables and full booking error message.
  const [inputAvailableTables, setInputAvailableTables] = useState<
    number | null
  >(null);
  const [fullyBookedError, setFullyBookedError] = useState<string | null>(null);

  const { data: reservations } = useGetGroupReservations();
  const { data: settingsData } = useGetEventReservationSettings();

  useEffect(() => {
    if (dateInput && reservations && settingsData) {
      const d = new Date(dateInput);
      if (!isNaN(d.getTime())) {
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const endOfDay = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate() + 1,
        );
        const reservationsForDay = reservations.filter(
          (r: { date: string; partySize: number }) => {
            const resDate = new Date(r.date);
            return resDate >= startOfDay && resDate < endOfDay;
          },
        );
        const totalBookedTables = reservationsForDay.reduce((sum, r) => {
          return (
            sum + Math.ceil(r.partySize / settingsData.groupMaxGuestsPerTable)
          );
        }, 0);
        const available = settingsData.groupMaxTablesPerDay - totalBookedTables;
        setInputAvailableTables(available);
        setFullyBookedError(
          available === 0
            ? "The date you picked is fully booked. Please choose another date."
            : null,
        );
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
        {/* Full Name Field */}
        <div className="relative flex-1">
          <Label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            // Error styling applied when an error exists
            className={`mb-4 mt-1 w-full rounded border p-3 focus:outline-secondary ${
              errors.fullName ? "border-red-500 bg-red-200 pr-10" : ""
            }`}
          />
          {errors.fullName && (
            <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-[80%] text-red-700" />
          )}
          {errors.fullName && (
            <div className="text-sm text-red-700">
              {typeof errors.fullName.message === "string"
                ? errors.fullName.message
                : ""}
            </div>
          )}
        </div>

        {/* Contact Number Field */}
        <div className="relative flex-1">
          <Label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            {...register("contactNumber")}
            className={`mb-4 mt-1 w-full rounded border p-3 focus:outline-secondary ${
              errors.contactNumber ? "border-red-500 bg-red-200 pr-10" : ""
            }`}
          />
          {errors.contactNumber && (
            <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-[80%] text-red-700" />
          )}
          {errors.contactNumber && (
            <div className="text-sm text-red-700">
              {typeof errors.contactNumber.message === "string"
                ? errors.contactNumber.message
                : ""}
            </div>
          )}
        </div>
      </div>

      {/* Party Size Field */}
      <div className="lg:flex lg:space-x-2">
        <div className="relative flex-1">
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
            className={`mt-1 w-full rounded border p-3 focus:outline-secondary ${
              errors.partySize ? "border-red-500 bg-red-200 pr-10" : ""
            }`}
          />
          {errors.partySize && (
            <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-[80%] text-red-700" />
          )}
          {errors.partySize && (
            <div className="mt-2 text-sm text-red-700">
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

      {/* Calendar for visual feedback */}
      <GroupCalendar />

      {/* Date Field */}
      <div className="relative mt-6">
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
          className={`mb-4 mt-1 w-full rounded border p-3 focus:outline-secondary ${
            errors.date ? "border-red-500 bg-red-200 pr-10" : ""
          }`}
        />
        {errors.date && (
          <TriangleAlert className="absolute right-4 top-1/2 h-5 w-5 -translate-y-[80%] text-red-700" />
        )}
        {errors.date && (
          <div className="text-sm text-red-700">
            {typeof errors.date.message === "string" ? errors.date.message : ""}
          </div>
        )}
      </div>

      {/* Start and End Time Fields */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </Label>
          <HourlyTimePicker
            isStartTime
            value={startTime}
            onChange={(time) => setValue("startTime", time)}
          />
          {errors.startTime && (
            <div className="text-sm text-red-700">
              {typeof errors.startTime.message === "string"
                ? errors.startTime.message
                : ""}
            </div>
          )}
        </div>
        <div className="relative flex-1">
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
            <div className="text-sm text-red-700">
              {typeof errors.endTime.message === "string"
                ? errors.endTime.message
                : ""}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <Button
        type="button"
        onClick={handleNextStep}
        className={`mt-10 ${inputAvailableTables === 0 ? "cursor-not-allowed bg-gray-300" : ""}`}
        disabled={inputAvailableTables === 0}
      >
        Next
      </Button>
      {fullyBookedError && (
        <p className="mt-2 text-center text-sm text-red-500">
          {fullyBookedError}
        </p>
      )}
    </>
  );
};

export default GroupStep1;
