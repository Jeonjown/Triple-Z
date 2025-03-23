// EventForm.tsx
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetEventReservationSettings } from "../hooks/useGetEventReservationSettings";
import EventStep1 from "../components/events-form/EventStep1";
import EventStep2 from "../components/events-form/EventStep2";
import EventStep3 from "../components/events-form/EventStep3";
import EventStep4 from "../components/events-form/EventStep4";
import { ProgressBar } from "@/components/ProgressBar";
import { SelectedItem } from "../components/events-form/EmbeddedMenu";

export type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
  size?: string;
};

const defaultMinGuests = 24;
const defaultMinDaysPrior = 14;

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
          const selectedDateOnly = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          const minDate = new Date();
          minDate.setDate(minDate.getDate() + minDaysPrior);
          const minDateOnly = new Date(
            minDate.getFullYear(),
            minDate.getMonth(),
            minDate.getDate(),
          );
          return selectedDateOnly >= minDateOnly;
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
        price: z.number().min(0, "Price cannot be negative"),
        totalPrice: z.number().min(0, "Total Price cannot be negative"),
        image: z.string().url("Image URL must be a valid URL"),
        size: z.string().optional(),
      }),
    ),
    specialRequest: z.string().optional(),
  });

export type EventFormValues = z.infer<ReturnType<typeof getReservationSchema>>;

const EventForm = () => {
  const { data: settings } = useGetEventReservationSettings();
  const minGuests = settings?.eventMinGuests || defaultMinGuests;
  const minDaysPrior = settings?.eventMinDaysPrior || defaultMinDaysPrior;

  const reservationSchema = useMemo(
    () => getReservationSchema(minGuests, minDaysPrior),
    [minGuests, minDaysPrior],
  );

  const [selectedPackageIds, setSelectedPackageIds] = useState<SelectedItem[]>(
    [],
  );
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    { step: 1, label: "Details" },
    { step: 2, label: "Packages" },
    { step: 3, label: "Confirm" },
    { step: 4, label: "Thank You" },
  ];

  const stepTexts = [
    {
      header: "Make a Reservation",
      description:
        "Select your details and we'll try to get the best seats for you.",
    },
    {
      header: "Choose Your Packages",
      description: "Select the packages you want to add to your reservation.",
    },
    {
      header: "Confirm Your Reservation",
      description: "Review your details and packages before confirming.",
    },
    {
      header: "Thank you for your reservation!",
      description: "",
    },
  ];

  // Set mode to "onChange" for realtime validation
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "Jon Stewart Doe",
      contactNumber: "6019521325",
      partySize: minGuests,
      date: "2025-03-08",
      startTime: "10:00 AM",
      endTime: "3:00 PM",
      eventType: "sdfsdf",
      specialRequest: "you are my special",
      cart: [],
    },
  });

  useEffect(() => {
    methods.reset({
      fullName: "Jon Stewart Doe",
      contactNumber: "6019521325",
      partySize: minGuests,
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
      <div className="mx-auto mt-20 flex flex-col items-center justify-center space-y-8 p-5 md:mt-10">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full max-w-4xl"
        >
          <div className="md:shadow-aesthetic flex w-full flex-col">
            {currentStep !== 4 ? (
              <>
                <h2 className="mb-4 text-center font-heading text-3xl">
                  {stepTexts[currentStep - 1].header}
                </h2>
                <p className="text-center">
                  {stepTexts[currentStep - 1].description}
                </p>
              </>
            ) : (
              <h2 className="mb-4 text-center text-4xl">
                {stepTexts[3].header}
              </h2>
            )}
            <ProgressBar currentStep={currentStep} steps={steps} />
            {currentStep === 1 && (
              <EventStep1 nextStep={nextStep} minGuests={minGuests} />
            )}
            {currentStep === 2 && (
              <EventStep2
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
              <EventStep3
                prevStep={prevStep}
                nextStep={nextStep}
                methods={methods}
                cart={cart}
              />
            )}
            {currentStep === 4 && <EventStep4 />}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default EventForm;
