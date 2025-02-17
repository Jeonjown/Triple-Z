import { Button } from "@/components/ui/button";
import { EventFormValues } from "../pages/EventForm";
import { useFormContext } from "react-hook-form";
import ScrollToTop from "@/components/ScrollToTop";

type Step1Props = {
  nextStep: () => void;
};

const Step1 = ({ nextStep }: Step1Props) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<EventFormValues>(); // Use the hook here
  // Trigger validation for Step1 fields.
  const handleNextStep = async () => {
    const valid = await trigger([
      "fullName",
      "phoneNumber",
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
      <div className="mt-10">
        <label htmlFor="fullName" className="block">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          {...register("fullName")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.fullName ? "border-red-500" : ""
          }`}
        />
        {errors.fullName && (
          <div className="text-xs text-red-700">{errors.fullName.message}</div>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          {...register("phoneNumber")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.phoneNumber ? "border-red-500" : ""
          }`}
        />
        {errors.phoneNumber && (
          <div className="text-xs text-red-700">
            {errors.phoneNumber.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="partySize" className="block">
          Party Size
        </label>
        <input
          type="number"
          min={24} // Assuming the minimum party size is 24
          placeholder="minimum of 24"
          {...register("partySize")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.partySize ? "border-red-500" : ""
          }`}
        />
        {errors.partySize && (
          <div className="text-xs text-red-700">{errors.partySize.message}</div>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block">
          Date
        </label>
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

      <div>
        <label htmlFor="startTime" className="block">
          Start Time
        </label>
        <input
          type="time"
          {...register("startTime")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.startTime ? "border-red-500" : ""
          }`}
        />
        {errors.startTime && (
          <div className="text-xs text-red-700">{errors.startTime.message}</div>
        )}
      </div>

      <div>
        <label htmlFor="endTime" className="block">
          End Time
        </label>
        <input
          type="time"
          {...register("endTime")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.endTime ? "border-red-500" : ""
          }`}
        />
        {errors.endTime && (
          <div className="text-xs text-red-700">{errors.endTime.message}</div>
        )}
      </div>

      <div>
        <label htmlFor="eventType" className="block">
          Event Type
        </label>
        <input
          type="text"
          id="eventType"
          {...register("eventType")}
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
            errors.eventType ? "border-red-500" : ""
          }`}
        />
        {errors.eventType && (
          <div className="text-xs text-red-700">{errors.eventType.message}</div>
        )}
      </div>

      <Button type="button" onClick={handleNextStep}>
        Next
      </Button>
    </>
  );
};

export default Step1;
