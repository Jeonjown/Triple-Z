import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Step2 from "../components/Step2";
import Step1 from "../components/Step1";
import Step4 from "../components/Step4";
import Step3 from "../components/Step3";
import useAuthStore from "@/features/Auth/stores/useAuthStore";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
};

// Define the Zod schema for your form values
const reservationSchema = z.object({
  userId: z.string().nonempty("You must be logged in."),
  fullName: z.string().nonempty("Full Name is required."),
  contactNumber: z.string().nonempty("Contact is required"),
  partySize: z.preprocess(
    (val) => Number(val),
    z.number().min(24, "Party size must be at least 24"),
  ),
  date: z
    .string()
    .nonempty("Date is required")
    .refine((val) => {
      const selectedDate = new Date(val);
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14); // Add 14 days
      return selectedDate >= twoWeeksFromNow;
    }, "Date must be at least two weeks in advance"),
  startTime: z.string().nonempty("Start Time is required"),
  endTime: z.string().nonempty("End Time is required"),
  eventType: z.string().nonempty("Event Type is required"),
  cart: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        totalPrice: z.number().min(0, "Total Price cannot be negative"),
        image: z.string().url("Image URL must be a valid URL"),
      }),
    )
    .min(1, "At least one item must be in the cart"),
});

// Infer the form data type from the schema
export type EventFormValues = z.infer<typeof reservationSchema>;

const MultiStepForm = () => {
  const { user } = useAuthStore();
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      userId: user?._id,
      fullName: "",
      contactNumber: "",
      partySize: 24,
      date: new Date().toISOString().split("T")[0], // Initial date as today's date
      startTime: "",
      endTime: "",
      eventType: "",
      cart: [],
    },
  });

  const { reset } = methods;

  const onSubmit = (data: EventFormValues) => {
    console.log("Form Submitted:", data);
    reset();
    nextStep();
  };

  return (
    <>
      <FormProvider {...methods}>
        {/* Parent container with flex for centering */}
        <div className="mx-auto flex flex-col items-center justify-center space-y-8">
          {/* Form container */}
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full max-w-lg"
          >
            <div className="md:shadow-aesthetic flex max-w-screen-sm flex-col border px-20">
              {/* Step-by-step content */}
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

              {/* Progress bar */}
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

              {/* Render the correct step */}
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
        </div>
      </FormProvider>
    </>
  );
};

export default MultiStepForm;
