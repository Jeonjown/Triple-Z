import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GroupStep1 from "../components/groups-form/GroupStep1";
import GroupStep2 from "../components/groups-form/GroupStep2";
import GroupStep3 from "../components/groups-form/GroupStep3";
import GroupStep4 from "../components/groups-form/GroupStep4";
import { SelectedItem } from "../components/groups-form/EmbeddedMenu";
import { useGetEventReservationSettings } from "../hooks/useGetEventReservationSettings";
import { ProgressBar } from "@/components/ProgressBar";

// Unified CartItem type
export type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
  size?: string;
};

// Updated Zod schema using normalized date validation
const getReservationSchema = (
  minReservation: number,
  maxReservation: number,
  minDaysPrior: number,
) =>
  z.object({
    fullName: z.string().nonempty("Full Name is required."),
    contactNumber: z.string().nonempty("Contact is required"),
    partySize: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(minReservation, `Party size must be at least ${minReservation}`)
        .max(maxReservation, `Party size must be at most ${maxReservation}`),
    ),
    date: z
      .string()
      .nonempty("Date is required")
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          // Normalize selected date (ignore hours/minutes)
          const normSelected = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          const now = new Date();
          // Create a normalized minimum date: today + minDaysPrior (date-only)
          const normMin = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          normMin.setDate(normMin.getDate() + minDaysPrior);
          return normSelected >= normMin;
        },
        { message: `Date must be at least ${minDaysPrior} day(s) in advance` },
      ),
    startTime: z.string().nonempty("Start Time is required"),
    endTime: z.string().nonempty("End Time is required"),
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
  });

export type GroupFormValues = z.infer<ReturnType<typeof getReservationSchema>>;

const GroupForm = () => {
  const { data: settings } = useGetEventReservationSettings();

  const minReservation = settings ? settings.groupMinReservation : 1;
  const maxReservation = settings ? settings.groupMaxReservation : 12;
  const minDaysPrior = settings ? settings.groupMinDaysPrior : 0;

  const reservationSchema = useMemo(
    () => getReservationSchema(minReservation, maxReservation, minDaysPrior),
    [minReservation, maxReservation, minDaysPrior],
  );

  // Multi-step form state
  const [selectedPackageIds, setSelectedPackageIds] = useState<SelectedItem[]>(
    [],
  );
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Define the steps array for the progress bar.
  const steps = [
    { step: 1, label: "Details" },
    { step: 2, label: "Packages" },
    { step: 3, label: "Confirm" },
    { step: 4, label: "Thank You" },
  ];

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const methods = useForm<GroupFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      contactNumber: "",
      partySize: minReservation,
      date: "",
      startTime: "",
      endTime: "",
      cart: [],
    },
  });

  useEffect(() => {
    methods.reset({
      fullName: "",
      contactNumber: "",
      partySize: minReservation,
      date: "",
      startTime: "",
      endTime: "",
      cart: [],
    });
  }, [methods, minReservation]);

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
            {/* Progress Bar Integration */}
            <ProgressBar currentStep={currentStep} steps={steps} />

            {currentStep === 1 && (
              <GroupStep1
                nextStep={nextStep}
                minReservation={minReservation}
                maxReservation={maxReservation}
                settings={settings}
              />
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

export default GroupForm;
