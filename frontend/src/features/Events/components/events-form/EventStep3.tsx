import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
// Adjust path based on your project structure
import { EventFormValues, CartItem } from "../../pages/EventForm";

// Import shadcn/ui components (ensure paths are correct)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import the custom hook
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings"; // Adjust the path as needed

// Helper functions remain the same
const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return "₱--.--";
  return `₱${amount.toFixed(2)}`;
};
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};
const formatDisplayTime = (
  startTime: string | undefined,
  durationHours: number | undefined,
): string => {
  if (!startTime || durationHours === undefined || durationHours <= 0)
    return "N/A";

  let startTime24h = startTime;

  // Check if startTime is in 12-hour format
  if (startTime.includes("AM") || startTime.includes("PM")) {
    try {
      const [time, modifier] = startTime.split(" ");
      let [hours, minutes] = time.split(":");

      if (hours === "12") {
        hours = "00";
      }

      if (modifier === "PM") {
        hours = `${parseInt(hours, 10) + 12}`; // Ensure hours is a string
      }

      startTime24h = `${hours}:${minutes}`;
    } catch (e) {
      console.error("Error parsing 12-hour startTime:", e);
      return "Invalid Start Time";
    }
  } else if (!/^\d{2}:\d{2}$/.test(startTime)) {
    // Keep the existing check for 24-hour format
    console.error("Invalid startTime format:", startTime);
    return "Invalid Start Time";
  }

  try {
    const [startHour, startMinute] = startTime24h.split(":").map(Number);
    if (isNaN(startHour) || isNaN(startMinute)) return "Invalid Start Time";
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000,
    );
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
  } catch (e) {
    console.error("Error formatting time:", e);
    return "Invalid Time";
  }
};

// Define Props interface (Matching EventForm call with prevStep/nextStep)
interface EventStep3Props {
  methods: UseFormReturn<EventFormValues>;
  cart: CartItem[];
  prevStep: () => void;
  nextStep: (data: EventFormValues) => void; // Assuming nextStep should handle the data
}

// --- CORRECTED Component Name ---
const EventStep3 = ({
  methods,
  cart,
  prevStep, // Use this prop now
  nextStep, // Use this prop now
}: EventStep3Props) => {
  // Get form values dynamically using watch
  const { watch } = methods;
  const formValues = watch();
  // Specifically watch the raw isCorkage value for reactivity in display logic
  const isCorkageRawValue = watch("isCorkage");

  // --- Fetch settings from backend ---
  const {
    data: settings,
    isPending: settingsLoading,
    isError: settingsError,
  } = useGetEventReservationSettings();

  console.log(settings?.eventTermsofService);

  // --- Local State for Payment Step ---
  const [paymentAmountOption, setPaymentAmountOption] = useState("partial");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [agreedToPaymentTerms, setAgreedToPaymentTerms] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false); // State for the dialog

  // --- Calculate Derived Values ---
  const eventFee = useMemo(() => settings?.eventFee ?? 0, [settings]);

  // Calculate corkageFee based on watched raw value (string "true")
  const corkageFee = useMemo(() => {
    const applyCorkage =
      isCorkageRawValue === true || isCorkageRawValue === "true";
    console.log(
      `EventStep4 - Apply Corkage: ${applyCorkage} (Raw Value: ${isCorkageRawValue})`,
    ); // Debug Log
    return applyCorkage ? (settings?.eventCorkageFee ?? 0) : 0;
  }, [isCorkageRawValue, settings]); // Depend on the watched value

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.totalPrice, 0),
    [cart],
  );

  // Calculate total price including the derived corkageFee
  const totalPrice = useMemo(() => {
    console.log(
      `EventStep4 - Calculating Total: cart=${cartTotal}, event=${eventFee}, corkage=${corkageFee}`,
    );
    return cartTotal + eventFee + corkageFee;
  }, [cartTotal, eventFee, corkageFee]); // Depend on calculated fees/totals

  const partialAmount = useMemo(() => settings?.eventFee ?? 1000, [settings]);
  const fullAmount = useMemo(() => totalPrice, [totalPrice]);
  const balanceDue = useMemo(
    () =>
      paymentAmountOption === "partial"
        ? Math.max(0, totalPrice - partialAmount)
        : 0,
    [paymentAmountOption, totalPrice, partialAmount],
  );

  // Determine if the user can proceed
  const canProceed = useMemo(
    () => paymentMethod && agreedToPaymentTerms,
    [paymentMethod, agreedToPaymentTerms],
  );

  // --- New Submit Handler Function ---
  const onSubmit = (data: EventFormValues) => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (!agreedToPaymentTerms) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }
    console.log("Final Form Data:", {
      ...data,
      cart,
      paymentAmountOption,
      paymentMethod,
    });
    nextStep({ ...data, cart, paymentAmountOption, paymentMethod }); // Pass the data to the next step
  };

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {settingsLoading && <div>Loading settings...</div>}
      {settingsError && <div>Error loading settings.</div>}
      {settings && (
        <>
          {/* Payment Amount Options */}
          <RadioGroup
            value={paymentAmountOption}
            onValueChange={setPaymentAmountOption}
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Label
              htmlFor="payFull"
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary`}
            >
              <RadioGroupItem value="full" id="payFull" />
              <span>Pay in Full of {formatCurrency(fullAmount)}</span>
            </Label>
            <Label
              htmlFor="payPartial"
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary`}
            >
              <RadioGroupItem value="partial" id="payPartial" />
              <span>Pay partial amount of {formatCurrency(partialAmount)}</span>
            </Label>
          </RadioGroup>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Left Column: Payment Options & Terms */}
            <div className="w-full md:w-1/2 lg:w-2/5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Choose Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* UPDATE: Reflect available methods */}
                  <RadioGroup
                    value={paymentMethod ?? ""}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    {["Online Payment", "Cash"].map((method) => {
                      const methodValue = method.toLowerCase().replace("-", "");
                      return (
                        <Label
                          key={method}
                          htmlFor={methodValue}
                          className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-muted`}
                        >
                          <RadioGroupItem
                            value={methodValue}
                            id={methodValue}
                          />
                          <span>{method}</span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>
              {/* Payment Terms Agreement */}
              <div className="mt-6 flex items-center space-x-2">
                <Checkbox
                  id="paymentTerms"
                  checked={agreedToPaymentTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToPaymentTerms(Boolean(checked))
                  }
                  aria-label="Agree to Terms and Conditions"
                />
                <Label
                  htmlFor="paymentTerms"
                  className={`cursor-pointer text-sm font-normal text-gray-700`}
                >
                  {" "}
                  I agree to the TripleZ{" "}
                  <Dialog
                    open={openTermsDialog}
                    onOpenChange={setOpenTermsDialog}
                  >
                    <DialogTrigger asChild>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTermsDialog(true);
                        }}
                        className="text-primary underline hover:text-primary/80"
                      >
                        Terms & Conditions
                      </Link>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Terms and Conditions</DialogTitle>
                        <DialogDescription>
                          Please read and accept the following terms and
                          conditions.
                        </DialogDescription>
                      </DialogHeader>
                      <div
                        className="max-h-[400px] overflow-y-auto p-4"
                        style={{ whiteSpace: "pre-line" }} // Add this style
                      >
                        {settings?.eventTermsofService ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: settings.eventTermsofService,
                            }}
                          />
                        ) : (
                          <p>Terms and conditions are not available.</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={() => setOpenTermsDialog(false)}
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Label>
              </div>
              {/* Disclaimer Text */}
              <p className="mt-4 text-xs text-muted-foreground">
                {" "}
                By selecting 'Proceed', you confirm your reservation details and
                agree to the payment terms and cancellation policies.{" "}
              </p>
            </div>

            {/* Right Column: Reservation Details Summary */}
            <div className="w-full md:w-1/2 lg:w-3/5">
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">Reservation Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  {/* Basic Details */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Full name:
                      </p>
                      <p>{formValues.fullName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Phone Number:
                      </p>
                      <p>{formValues.contactNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Event Type:
                      </p>
                      <p>{formValues.eventType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Party Size:
                      </p>
                      <p>{formValues.partySize || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Date:</p>
                      <p>{formatDate(formValues.date)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Time:</p>
                      <p>
                        {formatDisplayTime(
                          formValues.startTime,
                          formValues.estimatedEventDuration,
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Special Request */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Special Request:
                    </p>
                    <p className="mt-1 min-h-[40px] rounded border border-dashed bg-muted/50 p-2 text-sm text-foreground">
                      {formValues.specialRequest || "None"}
                    </p>
                  </div>
                  <Separator />
                  {/* Itemized List */}
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-2 text-sm">
                    <div className="sticky top-0 grid grid-cols-12 gap-2 bg-card py-1 font-medium text-muted-foreground">
                      <div className="col-span-2">QTY</div>
                      <div className="col-span-7">ITEM</div>
                      <div className="col-span-3 text-right">TOTAL</div>
                    </div>
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div key={item._id} className="grid grid-cols-12 gap-2">
                          <div className="col-span-2">{item.quantity}</div>
                          <div className="col-span-7 truncate">
                            {item.title}
                          </div>
                          <div className="col-span-3 text-right">
                            {formatCurrency(item.totalPrice)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-2 text-center text-muted-foreground">
                        No items selected.
                      </p>
                    )}
                  </div>

                  {/* --- Fees --- */}
                  <div className="space-y-1 border-t pt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Event Fee:</span>
                      <span className="font-medium">
                        {formatCurrency(eventFee)}
                      </span>
                    </div>
                    {/* --- ADDED CORKAGE FEE DISPLAY --- */}
                    {(isCorkageRawValue === true ||
                      isCorkageRawValue === "true") && (
                      <div className="flex justify-between">
                        <span>Corkage Fee:</span>
                        {/* Use the calculated corkageFee variable */}
                        <span className="font-medium">
                          {formatCurrency(corkageFee)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* --- Totals --- */}
                  <div className="mt-auto space-y-2 border-t pt-4">
                    <div className="text-md flex items-center justify-between font-semibold">
                      <span>Total Price:</span>
                      {/* totalPrice already includes conditional corkageFee */}
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-orange-100 p-3 text-lg font-bold text-orange-800">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(balanceDue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-10 flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={prevStep}>
              {" "}
              Back{" "}
            </Button>
            <Button
              size="lg"
              onClick={methods.handleSubmit(onSubmit)} // Use handleSubmit here
              disabled={!canProceed}
            >
              {" "}
              Proceed{" "}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventStep3;
