import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";

// Define the Zod schema for your form values
const reservationSchema = z
  .object({
    fullName: z.string().nonempty("Full Name is required."),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{11}$/, "Phone Number must be exactly 11 digits"),
    partySize: z.preprocess(
      (val) => Number(val),
      z.number().min(24, "Party size must be at least 24"),
    ),
    // Keep date as a string; we'll validate by converting it to a Date for comparison.
    date: z
      .string()
      .nonempty("Date is required")
      .refine(
        (val) => new Date(val) >= new Date(new Date().toDateString()),
        "Date cannot be in the past",
      ),
    startTime: z.string().nonempty("Start Time is required"),
    endTime: z.string().nonempty("End Time is required"),
    eventType: z.string().nonempty("Event Type is required"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End Time must be after Start Time",
    path: ["endTime"],
  });

// Infer the form data type from the schema
type FormValues = z.infer<typeof reservationSchema>;

const MultiStepForm = () => {
  // State to track the current step
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Set up React Hook Form with Zod resolver.
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      partySize: 0,
      date: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" format
      startTime: "",
      endTime: "",
      eventType: "",
    },
    shouldUnregister: true,
  });

  // Form submit handler (called on final submission)
  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
    nextStep();
  };

  // Step 1: Basic Reservation Details
  type Step1Props = {
    nextStep: () => void;
  };

  const Step1 = ({ nextStep }: Step1Props) => {
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
            <div className="text-xs text-red-700">
              {errors.fullName.message}
            </div>
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
            placeholder="minimum of 24"
            {...register("partySize")}
            className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${
              errors.partySize ? "border-red-500" : ""
            }`}
          />
          {errors.partySize && (
            <div className="text-xs text-red-700">
              {errors.partySize.message}
            </div>
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
            <div className="text-xs text-red-700">
              {errors.startTime.message}
            </div>
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
            <div className="text-xs text-red-700">
              {errors.eventType.message}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextStep}
          className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
        >
          Next
        </button>
      </>
    );
  };

  // Step 2: Package Selection and Pre-Order Details (example; adjust as needed)
  type Step2Props = {
    nextStep: () => void;
    prevStep: () => void;
  };

  const Step2 = ({ prevStep, nextStep }: Step2Props) => {
    const [selectedPackage, setSelectedPackage] = useState("");
    const [selectedAdditional, setSelectedAdditional] = useState("");

    const handleSelectedPackage = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPackage(e.target.value);
    };

    const handleSelectedAdditional = (
      e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setSelectedAdditional(e.target.value);
    };

    return (
      <>
        <label className="mb-2 mt-5">Package</label>
        <select
          className="block w-full rounded-md border px-6 py-2 focus:outline-none"
          onChange={handleSelectedPackage}
          defaultValue=""
        >
          <option value="" disabled>
            Select your food
          </option>
          <option value="Merienda Budgetarian">Merienda Budgetarian</option>
          <option value="Light and Sweet Desert">Light and Sweet Desert</option>
          <option value="Cravings Satisfied Busog">
            Cravings Satisfied Busog
          </option>
          <option value="Heavy Arabian Meal">Heavy Arabian Meal</option>
        </select>
        <label className="mb-2 mt-5">Additionals</label>
        <select
          className="block w-full rounded-md border px-6 py-2 focus:outline-none"
          onChange={handleSelectedAdditional}
          defaultValue=""
        >
          <option value="" disabled>
            Select your food
          </option>
          <option value="Extra Shawarma">Extra Shawarma</option>
          <option value="Beefy Burger">Beefy Burger</option>
          <option value="Quesadilla">Quesadilla</option>
          <option value="Chicha Platter">Chicha Platter</option>
        </select>
        <p className="mb-2 mt-5">Pre Order</p>
        <div className="block w-full rounded-md border bg-[#F8F8F8] p-8">
          {selectedPackage && <div>{selectedPackage}</div>}
          {selectedAdditional && <div>{selectedAdditional}</div>}
        </div>
        <label className="mb-2 mt-5">Notes</label>
        <textarea
          className="block w-full rounded-md border p-10 focus:outline-none"
          placeholder="Special Request"
        ></textarea>
        <div className="mt-5 flex gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
          >
            Next
          </button>
        </div>
      </>
    );
  };

  // Step 3: Confirmation
  type Step3Props = {
    nextStep: () => void;
    prevStep: () => void;
  };

  const Step3 = ({ prevStep, nextStep }: Step3Props) => {
    // Use watch to obtain current form values
    const formValues = watch();

    const formatDate = (date: Date) => {
      const d = new Date(date);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const year = d.getFullYear();
      return `${month}-${day}-${year}`;
    };

    const militaryToStandard = (militaryTime: string | undefined): string => {
      if (!militaryTime) return "";
      const parts = militaryTime.split(":");
      if (parts.length < 2) return militaryTime;
      let hour: number = parseInt(parts[0], 10);
      const minute = parts[1];
      const ampm: string = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12;
      return `${hour}:${minute} ${ampm}`;
    };

    const handleCheckout = () => {
      nextStep();
      handleSubmit(onSubmit)();
    };

    return (
      <>
        <div className="mt-5 rounded-sm border p-8">
          <div className="text-text">Full Name:</div>
          <div className="font-semibold">{formValues.fullName}</div>
          <div className="text-text">Phone Number:</div>
          <div className="font-semibold">{formValues.phoneNumber}</div>
          <div className="text-text">Event Type:</div>
          <div className="font-semibold">{formValues.eventType}</div>
          <div className="text-text">Party Size:</div>
          <div className="font-semibold">{formValues.partySize}</div>
          <div className="text-text">Date:</div>
          <div className="font-semibold">
            {formValues.date ? formatDate(new Date(formValues.date)) : ""}
          </div>
          <div className="text-text">Time:</div>
          <div className="font-semibold">
            <span>{militaryToStandard(formValues.startTime)}</span> -{" "}
            <span>{militaryToStandard(formValues.endTime)}</span>
          </div>
          <div className="text-text">Preorder List:</div>
          <div className="font-semibold">WALA MONA GOLO AKO &lt;3</div>
        </div>
        <div className="mt-5 flex gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
          >
            Checkout
          </button>
        </div>
      </>
    );
  };

  // Step 4: Final Thank You Screen
  const Step4 = () => (
    <>
      <div className="mt-5 flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-green-700"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="mt-5 text-center text-lg">
        Your booking is currently <span className="font-semibold">pending</span>{" "}
        and will be reviewed by our team. You'll receive a confirmation once it
        has been approved by the Triple Z.
      </p>
      <p className="mt-10 text-center">
        You can view or modify your reservation in
      </p>
      <Link to="profile" replace>
        <p className="text-center font-semibold underline">My Account.</p>
      </Link>
      <Link to="/contacts" replace>
        <div className="mt-10 flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-center font-semibold underline">Go to Contacts</p>
        </div>
      </Link>
    </>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-auto justify-center"
    >
      <div className="md:shadow-aesthetic flex w-5/6 max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14">
        {/* Header */}
        {currentStep !== 4 ? (
          <>
            <h2 className="mb-4 text-center font-heading text-2xl">
              Make a Reservation
            </h2>
            <p className="text-center">
              Select your details and we'll try to get the best seats for you.
            </p>
          </>
        ) : (
          <h2 className="mb-4 text-center text-4xl">
            Thank you for your reservation!
          </h2>
        )}

        {/* Progress Bar (Desktop Only) */}
        <div className="relative mb-10 mt-10">
          <div className="relative m-auto h-1 w-[90%] rounded-full bg-gray-200">
            <div
              className="h-1 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (4 - 1)) * 100}%` }}
            ></div>
          </div>
          <div className="absolute -top-3 left-[5px] flex w-full justify-between">
            {[
              { step: 1, label: "Date" },
              { step: 2, label: "Menu Pre-Order" },
              { step: 3, label: "Confirmation" },
              { step: 4, label: "Checkout" },
            ].map(({ step, label }) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full border-2 ${
                    currentStep >= step
                      ? "border-primary bg-primary"
                      : "bg-gray-200"
                  } flex items-center justify-center text-sm font-semibold text-white`}
                >
                  {step}
                </div>
                <div className="mt-2 text-xs font-medium text-gray-600">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Render the appropriate step */}
        {currentStep === 1 && <Step1 nextStep={nextStep} />}
        {currentStep === 2 && <Step2 prevStep={prevStep} nextStep={nextStep} />}
        {currentStep === 3 && <Step3 prevStep={prevStep} nextStep={nextStep} />}
        {currentStep === 4 && <Step4 />}
      </div>
    </form>
  );
};

export default MultiStepForm;
