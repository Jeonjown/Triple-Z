import { Field, FormikErrors, FormikTouched, ErrorMessage } from "formik";
import EventCalendar from "./EventCalendar";

type StepProps = {
  touched: FormikTouched<{
    fullName: string;
    phoneNumber: string;
    partySize: number;
    date: string;
    startTime: string;
    endTime: string;
    eventType: string;
  }>;
  errors: FormikErrors<{
    fullName: string;
    phoneNumber: string;
    partySize: number;
    date: string;
    startTime: string;
    endTime: string;
    eventType: string;
  }>;
  nextStep: () => void;
};

const Step1 = ({ nextStep, touched, errors }: StepProps) => {
  const isValid =
    Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  const handleNextStep = () => {
    if (isValid) {
      nextStep();
    }
  };

  return (
    <>
      <div className="mt-10">
        <label htmlFor="fullName" className="block">
          Full Name
        </label>
        <Field
          type="text"
          id="fullName"
          name="fullName"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.fullName && errors.fullName ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="fullName"
          component="div"
          className="text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block">
          Phone Number
        </label>
        <Field
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.phoneNumber && errors.phoneNumber ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="phoneNumber"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="partySize" className="block">
          Party Size
        </label>
        <Field
          type="number"
          placeholder="minimum of 12"
          name="partySize"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.partySize && errors.partySize ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="partySize"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <Field
          type="date"
          name="date"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.date && errors.date ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="date"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="startTime">Start Time</label>
        <Field
          type="time"
          name="startTime"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.startTime && errors.startTime ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="startTime"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="endTime">End Time</label>
        <Field
          type="time"
          name="endTime"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.endTime && errors.endTime ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="endTime"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <div>
        <label htmlFor="eventType">Event Type</label>
        <Field
          type="text"
          id="eventType"
          name="eventType"
          className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.eventType && errors.eventType ? "border-red-500" : ""}`}
        />
        <ErrorMessage
          name="eventType"
          component="div"
          className="-mt-3 text-xs text-red-700"
        />
      </div>

      <EventCalendar />

      <button
        disabled={!isValid} // Disable button if form is invalid
        onClick={handleNextStep}
        className={`mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base ${!isValid ? "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60" : ""}`}
      >
        Next
      </button>
    </>
  );
};

export default Step1;
