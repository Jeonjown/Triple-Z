import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Step2 from "../components/Step2";
import Step1 from "../components/Step1";
import Step4 from "../components/Step4";
import Step3 from "../components/Step3";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
};

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
export type EventFormValues = z.infer<typeof reservationSchema>;

const MultiStepForm = () => {
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      partySize: 24,
      date: new Date().toISOString().split("T")[0], // Initial date as today's date
      startTime: "",
      endTime: "",
      eventType: "",
    },
  });

  const onSubmit = (data: EventFormValues) => {
    console.log("Form Submitted:", data);
    nextStep();
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex w-auto justify-center"
        >
          <div className="md:shadow-aesthetic flex w-5/6 max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14">
            {currentStep !== 4 ? (
              <>
                <h2 className="mb-4 text-center font-heading text-2xl">
                  Make a Reservation
                </h2>
                <p className="text-center">
                  Select your details and we'll try to get the best seats for
                  you.
                </p>
              </>
            ) : (
              <h2 className="mb-4 text-center text-4xl">
                Thank you for your reservation!
              </h2>
            )}

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

            {currentStep === 1 && <Step1 nextStep={nextStep} />}
            {currentStep === 2 && (
              <Step2
                selectedPackageIds={selectedPackageIds}
                setSelectedPackageIds={setSelectedPackageIds}
                quantityMap={quantityMap}
                setQuantityMap={setQuantityMap}
                cart={cart}
                setCart={setCart}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {currentStep === 3 && (
              <Step3
                prevStep={prevStep}
                nextStep={nextStep}
                methods={methods}
                cart={cart}
              />
            )}

            {currentStep === 4 && <Step4 />}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default MultiStepForm;
