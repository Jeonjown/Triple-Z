import { Button } from "@/components/ui/button";
import { EventFormValues } from "../pages/EventForm";
import { useFormContext } from "react-hook-form";
import ScrollToTop from "@/components/ScrollToTop";
import HourlyTimePicker from "./HourlyTimePicker";
import EventCalendar from "./EventCalendar";

type Step1Props = {
  nextStep: () => void;
};

const Step1 = ({ nextStep }: Step1Props) => {
  const {
    setValue,
    register,
    formState: { errors },
    trigger,
    watch, // Watch to monitor form values
  } = useFormContext<EventFormValues>(); // Use the hook here

  // Watch to get the startTime and endTime values
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Trigger validation for Step1 fields.
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
    if (valid) {
      nextStep();
    }
  };

  return (
    <>
      <ScrollToTop />
      <EventCalendar />
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
              {errors.fullName.message}
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
              {errors.contactNumber.message}
            </div>
          )}
        </div>
      </div>
      <div className="lg:flex lg:space-x-2">
        <div className="flex-1">
          <label htmlFor="partySize">Party Size</label>
          <input
            type="number"
            min={24} // Assuming the minimum party size is 24
            placeholder="minimum of 24"
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
          <label htmlFor="eventType">Event Type</label>
          <input
            type="text"
            id="eventType"
            placeholder="Ex. Birthday, Party "
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
          <div className="text-xs text-red-700">{errors.date.message}</div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startTime">Start Time</label>
          <HourlyTimePicker
            value={startTime} // Pass startTime to this picker
            onChange={(time) => {
              setValue("startTime", time);
            }}
          />
          {errors.startTime && (
            <div className="text-xs text-red-700">
              {errors.startTime.message}
            </div>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="endTime">End Time</label>
          <HourlyTimePicker
            value={endTime} // Pass endTime to this picker
            onChange={(time) => {
              setValue("endTime", time);
            }}
          />
          {errors.endTime && (
            <div className="text-xs text-red-700">{errors.endTime.message}</div>
          )}
        </div>
      </div>

      <Button type="button" onClick={handleNextStep} className="mt-10">
        Next
      </Button>
    </>
  );
};

export default Step1;
