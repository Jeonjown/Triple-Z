import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import GroupCalendar from "./GroupCalendar";
import { GroupFormValues } from "../../pages/GroupForm";

// Updated type for settings to reflect the new reservation fields.
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
  // Use the typed form context instead of "any"
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

  // Extract table capacity and available tables from settings; provide fallbacks.
  const maxGuestsPerTable = settings?.groupMaxGuestsPerTable || 6;
  const availableTables = settings?.groupMaxTablesPerDay ?? 0;

  // Calculate the number of tables required based on partySize and table capacity.
  const tablesOccupied = partySize
    ? Math.ceil(partySize / maxGuestsPerTable)
    : 0;

  const handleNextStep = async () => {
    const valid = await trigger([
      "fullName",
      "contactNumber",
      "partySize",
      "date",
      "startTime",
      "endTime",
    ]);
    if (valid) {
      nextStep();
    }
  };

  return (
    <>
      <ScrollToTop />
      <GroupCalendar />
      <h3 className="font-semibold text-primary">
        Available Tables For Today: {availableTables}
      </h3>
      <div className="mt-10 lg:flex lg:space-x-2">
        <div className="flex-1">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            {...register("fullName")}
            className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
              errors.fullName ? "border-red-500" : ""
            }`}
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
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            {...register("contactNumber")}
            className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
              errors.contactNumber ? "border-red-500" : ""
            }`}
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
          <label htmlFor="partySize">Party Size</label>
          <input
            type="number"
            min={minReservation}
            max={maxReservation}
            placeholder={`Allowed: ${minReservation} to ${maxReservation}`}
            {...register("partySize")}
            className={`w-full rounded border p-3 focus:outline-secondary ${
              errors.partySize ? "border-red-500" : ""
            }`}
          />
          {/* Display allowed range and table capacity information */}
          <p className="text-sm text-primary">
            Allowed guests per reservation: {minReservation} to {maxReservation}
            .
          </p>
          <p className="text-sm text-primary">
            Each table can accommodate: {maxGuestsPerTable} guests.
          </p>
          <p className="text-sm text-primary">
            Tables you will occupy: {tablesOccupied}
          </p>
          {errors.partySize && (
            <div className="text-xs text-red-700">
              {typeof errors.partySize.message === "string"
                ? errors.partySize.message
                : ""}
            </div>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          {...register("date")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.date ? "border-red-500" : ""
          }`}
        />
        {errors.date && (
          <div className="text-xs text-red-700">
            {typeof errors.date.message === "string" ? errors.date.message : ""}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startTime">Start Time</label>
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
          <label htmlFor="endTime">End Time</label>
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
      <Button type="button" onClick={handleNextStep} className="mt-10">
        Next
      </Button>
    </>
  );
};

export default GroupStep1;
