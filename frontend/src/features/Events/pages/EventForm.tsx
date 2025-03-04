import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Step2 from "../components/Step2";
import Step1 from "../components/Step1";
import Step4 from "../components/Step4";
import Step3 from "../components/Step3";
import { useGetReservationSettings } from "../hooks/useGetReservationSettings";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
};

const defaultMinGuests = 24;
const defaultMinDaysPrior = 14;

// Define the Zod schema for your form values
const getReservationSchema = (minGuests: number, minDaysPrior: number) =>
  z.object({
    fullName: z.string().nonempty("Full Name is required."),
    contactNumber: z.string().nonempty("Contact is required"),
    partySize: z.preprocess(
      (val) => Number(val),
      z.number().min(minGuests, `Party size must be at least ${minGuests}`),
    ),
    date: z
      .string()
      .nonempty("Date is required")
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          const minDate = new Date();
          minDate.setDate(minDate.getDate() + minDaysPrior);
          return selectedDate >= minDate;
        },
        { message: `Date must be at least ${minDaysPrior} days in advance` },
      ),
    startTime: z.string().nonempty("Start Time is required"),
    endTime: z.string().nonempty("End Time is required"),
    eventType: z.string().nonempty("Event Type is required"),
    cart: z.array(
      z.object({
        _id: z.string(),
        title: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        totalPrice: z.number().min(0, "Total Price cannot be negative"),
        image: z.string().url("Image URL must be a valid URL"),
      }),
    ),
    specialRequest: z.string().optional(),
  });

// Infer the form data type from the schema
export type EventFormValues = z.infer<ReturnType<typeof getReservationSchema>>;

const EventForm = () => {
  const { data: settings } = useGetReservationSettings();

  // Use settings or fallback to default values
  const minGuests = settings?.minGuests || defaultMinGuests;
  const minDaysPrior = settings?.minDaysPrior || defaultMinDaysPrior;

  const reservationSchema = useMemo(
    () => getReservationSchema(minGuests, minDaysPrior),
    [minGuests, minDaysPrior],
  );

  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Initialize the form with defaultValues using the current minGuests
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "Jon Stewart Doe",
      contactNumber: "6019521325",
      partySize: minGuests, // Initial party size is minGuests
      date: "2025-03-08",
      startTime: "10:00 AM",
      endTime: "3:00 PM",
      eventType: "sdfsdf",
      specialRequest: "you are my special",
      cart: [],
    },
  });

  // When minGuests changes, update the form's partySize using reset
  useEffect(() => {
    methods.reset({
      fullName: "Jon Stewart Doe",
      contactNumber: "6019521325",
      partySize: minGuests, // Update partySize to new minGuests
      date: "2025-03-08",
      startTime: "10:00 AM",
      endTime: "3:00 PM",
      eventType: "sdfsdf",
      specialRequest: "you are my special",
      cart: [],
    });
  }, [methods, minGuests]);

  const { reset } = methods;

  const onSubmit = (data: EventFormValues) => {
    console.log("Form Submitted from main:", data);
    reset();
    nextStep();
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto mt-10 flex flex-col items-center justify-center space-y-8 p-5">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full max-w-4xl"
        >
          <div className="md:shadow-aesthetic flex w-full flex-col">
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

            {/* Progress bar and steps here... */}
            {currentStep === 1 && (
              <Step1 nextStep={nextStep} minGuests={minGuests} />
            )}
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
  );
};

export default EventForm;
