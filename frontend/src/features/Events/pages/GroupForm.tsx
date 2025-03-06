import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GroupStep4 from "../components/groups-form/GroupStep4";
import GroupStep1 from "../components/groups-form/GroupStep1";
import GroupStep2 from "../components/groups-form/GroupStep2";
import GroupStep3 from "../components/groups-form/GroupStep3";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
};

// Define the Zod schema for your form values
const getReservationSchema = (minGuests: number, minDaysPrior: number) =>
  z.object({
    fullName: z.string().nonempty("Full Name is required."),
    contactNumber: z.string().nonempty("Contact is required"),
    partySize: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(minGuests, `Party size must be at least ${minGuests}`)
        .max(12, "Maximum party size per groups is 12 "),
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
        { message: `Date must be at least ${minDaysPrior} day in advance` },
      ),
    startTime: z.string().nonempty("Start Time is required"),
    endTime: z.string().nonempty("End Time is required"),
    eventType: z.string(),
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
export type GroupFormValues = z.infer<ReturnType<typeof getReservationSchema>>;

const EventForm = () => {
  // Use settings or fallback to default values
  const minGuests = 6;
  const minDaysPrior = 1;

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
  const methods = useForm<GroupFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "Jon Stewart Doe",
      contactNumber: "6019521325",
      partySize: minGuests, // Initial party size is minGuests
      date: "2025-03-08",
      startTime: "10:00 AM",
      endTime: "3:00 PM",
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
      specialRequest: "you are my special",
      cart: [],
    });
  }, [methods, minGuests]);

  const { reset } = methods;

  const onSubmit = (data: GroupFormValues) => {
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
              <GroupStep1 nextStep={nextStep} minGuests={minGuests} />
            )}
            {currentStep === 2 && (
              <GroupStep2
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
              <GroupStep3
                prevStep={prevStep}
                nextStep={nextStep}
                methods={methods}
                cart={cart}
              />
            )}
            {currentStep === 4 && <GroupStep4 />}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default EventForm;
