import { useState } from "react"; // Make sure useEffect is imported

import { UseFormReturn } from "react-hook-form"; // Import UseFormReturn

import { EventFormValues, CartItem } from "../../pages/EventForm";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import { useCreateEventReservations } from "../../hooks/useCreateEventReservations";

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

// --- Helper formatters ---
const formatCurrency = (amount?: number | null) =>
  amount != null ? `₱${amount.toFixed(2)}` : "₱--.--";

const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
};

const formatDisplayTime = (
  startTime?: string,
  durationHours?: number,
): string => {
  if (!startTime || !durationHours || durationHours <= 0) return "N/A";
  const parse = (s: string) => {
    const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) {
      let h = +m[1];
      const min = +m[2];
      if (/PM$/i.test(m[3]) && h !== 12) h += 12;
      if (/AM$/i.test(m[3]) && h === 12) h = 0;
      return { h, min };
    }
    const [hStr, minStr] = s.split(":");
    return { h: +hStr, min: +minStr };
  };
  const { h, min } = parse(startTime);
  const start = new Date();
  start.setHours(h, min, 0, 0);
  const end = new Date(start.getTime() + durationHours * 3600_000);
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return `${fmt.format(start)} - ${fmt.format(end)}`;
};

// --- Props ---
interface EventStep3Props {
  methods: UseFormReturn<EventFormValues>; // Keep receiving methods
  cart: CartItem[];
  prevStep: () => void;
  // Include nextStep prop
  nextStep: () => void;
  // Correct the type for setPaymentLink to accept a string or null
  setPaymentLink: (link: string | null) => void;
}

export default function EventStep3({
  methods,
  cart,
  prevStep,
  // Destructure nextStep and setPaymentLink
  nextStep,
  setPaymentLink,
}: EventStep3Props) {
  const formValues = methods.watch();

  // 1) Load settings
  const {
    data: settings,
    isPending: settingsLoading,
    isError: settingsError,
  } = useGetEventReservationSettings();

  // 2) Prepare mutation
  const { mutate, isPending: isSubmitting } = useCreateEventReservations();

  // 3) Local UI state
  // Keep track of the selected payment amount option (only relevant for online payment)
  const [paymentAmountOption, setPaymentAmountOption] = useState<
    "full" | "partial"
  >("partial");
  // Keep track of the selected payment method (Cash or Online)
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "online payment" | null
  >(null);
  const [agreedToPaymentTerms, setAgreedToPaymentTerms] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);

  // 4) Derived calculations
  const eventFee = settings?.eventFee ?? 0;
  const corkageFee = formValues.isCorkage
    ? (settings?.eventCorkageFee ?? 0)
    : 0;
  const cartTotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalPrice = cartTotal + eventFee + corkageFee;
  const partialAmount = settings?.eventFee ?? 0;
  const balanceDue =
    // Balance due logic depends on payment method AND option if online
    paymentMethod === "cash"
      ? totalPrice // If cash, balance due is full price
      : paymentAmountOption === "partial"
        ? Math.max(0, totalPrice - partialAmount) // If online & partial, show remaining balance
        : 0; // If online & full, balance due is 0

  const canProceed = Boolean(
    paymentMethod && agreedToPaymentTerms && !settingsLoading,
  );

  // 5) Submit handler - This function is called by methods.handleSubmit
  const onSubmit = (data: EventFormValues) => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (!agreedToPaymentTerms) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    const payload = {
      ...data,
      cart,
      // Only include paymentAmountOption if payment method is online
      ...(paymentMethod === "online payment" && { paymentAmountOption }),
      paymentMethod,
    };

    // Call mutate and handle success within the mutation callback here in the component
    mutate(payload, {
      onSuccess: (responseData) => {
        console.log("Mutation successful in Step3:", responseData);
        // Use the prop to set the payment link in the parent state
        // The backend should return the paymentLink ONLY for online payments
        setPaymentLink(responseData.reservation.paymentLink || null); // Ensure null if link is missing
        // Use the prop to move to the next step in the parent state
        nextStep();
        // Parent (EventForm) now has the paymentLink state updated and the step advanced.
      },
      // onError is handled in the useCreateEventReservations hook
    });
  };

  // 6) Render
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {settingsLoading && <p>Loading settings…</p>}
      {settingsError && <p>Error loading settings.</p>}

      {settings && (
        <>
          {/* Main container for the flexible sections */}
          {/* Use flex-col for overall vertical stacking, gap for spacing */}
          <div className="flex flex-col gap-8">
            {/* Top Row / Section: Payment Methods & (Conditional) Payment Amount */}
            {/* This will be a flex row on medium screens and above */}
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Left Column: Payment Method & Terms Checkbox */}
              <div className="w-full space-y-6 md:w-1/2 lg:w-2/5">
                {/* --- Payment Methods (Moved UP) --- */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod ?? ""}
                      onValueChange={(v) => {
                        setPaymentMethod(v as "cash" | "online payment");
                        // Reset payment amount option if switching to cash
                        if (v === "cash") {
                          setPaymentAmountOption("partial"); // or 'full', doesn't matter as it's hidden
                        }
                      }}
                      className="space-y-3"
                    >
                      {[
                        { label: "Cash", value: "cash" },
                        { label: "Online Payment", value: "online payment" },
                      ].map(({ label, value }) => (
                        <Label
                          key={value}
                          htmlFor={value.replace(" ", "")}
                          className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-muted"
                        >
                          <RadioGroupItem
                            id={value.replace(" ", "")}
                            value={value}
                          />
                          {label}
                        </Label>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* --- Payment Amount Choice (Conditionally appears here) --- */}
                {/* Only render if Online Payment is selected */}
                {paymentMethod === "online payment" && (
                  <RadioGroup
                    value={paymentAmountOption}
                    onValueChange={(v) =>
                      setPaymentAmountOption(v as "full" | "partial")
                    }
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <Label
                      htmlFor="payFull"
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-4 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary"
                    >
                      <RadioGroupItem value="full" id="payFull" />
                      Pay in Full of {formatCurrency(totalPrice)}
                    </Label>
                    <Label
                      htmlFor="payPartial"
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-4 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary"
                    >
                      <RadioGroupItem value="partial" id="payPartial" />
                      Pay Partial of {formatCurrency(partialAmount)}
                    </Label>
                  </RadioGroup>
                )}

                {/* Terms Checkbox and "By clicking..." text remain here */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paymentTerms"
                    checked={agreedToPaymentTerms}
                    onCheckedChange={(c) => setAgreedToPaymentTerms(!!c)}
                  />
                  <Label
                    htmlFor="paymentTerms"
                    className="cursor-pointer text-sm"
                  >
                    I agree to the{" "}
                    <Dialog
                      open={openTermsDialog}
                      onOpenChange={setOpenTermsDialog}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="inline text-primary underline"
                          onClick={() => setOpenTermsDialog(true)}
                        >
                          Terms & Conditions
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Terms & Conditions</DialogTitle>
                          <DialogDescription>
                            Please read and accept below terms.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-60 overflow-y-auto p-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                settings.eventTermsofService ||
                                "<p>No terms available.</p>",
                            }}
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setOpenTermsDialog(false)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  By clicking “Proceed” you confirm your details and agree to
                  our policies.
                </p>
              </div>

              {/* Right Column: Reservation Summary */}
              <div className="w-full md:w-1/2 lg:w-3/5">
                {/* --- Reservation Summary (Remains in the right column) --- */}
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle>Reservation Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Name:
                        </p>
                        <p>{formValues.fullName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Phone:
                        </p>
                        <p>{formValues.contactNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Event:
                        </p>
                        <p>{formValues.eventType || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Guests:
                        </p>
                        <p>{formValues.partySize || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Date:
                        </p>
                        <p>{formatDate(formValues.date)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Time:
                        </p>
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
                      <p className="font-medium text-muted-foreground">
                        Special Request:
                      </p>
                      <p className="mt-1 rounded border border-dashed bg-muted/50 p-2 text-sm">
                        {formValues.specialRequest || "None"}
                      </p>
                    </div>
                    <Separator />
                    {/* Cart Items */}
                    <div className="max-h-40 space-y-2 overflow-y-auto pr-2 text-sm">
                      <div className="sticky top-0 grid grid-cols-12 gap-2 bg-card py-1 font-medium text-muted-foreground">
                        <div className="col-span-2">QTY</div>
                        <div className="col-span-7">ITEM</div>
                        <div className="col-span-3 text-right">TOTAL</div>
                      </div>
                      {cart.length > 0 ? (
                        cart.map((item) => (
                          <div
                            key={item._id}
                            className="grid grid-cols-12 gap-2"
                          >
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
                    {/* Fees & Totals */}
                    <div className="space-y-1 border-t pt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Event Fee:</span>
                        <span className="font-medium">
                          {formatCurrency(eventFee)}
                        </span>
                      </div>
                      {formValues.isCorkage && (
                        <div className="flex justify-between">
                          <span>Corkage Fee:</span>
                          <span className="font-medium">
                            {formatCurrency(corkageFee)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto space-y-2 border-t pt-4">
                      <div className="text-md flex justify-between font-semibold">
                        <span>Total Price:</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between rounded-md bg-orange-100 p-3 text-lg font-bold text-orange-800">
                        <span>Balance Due:</span>
                        {/* Show Balance Due based on the calculated balanceDue */}
                        <span>{formatCurrency(balanceDue)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>{" "}
            {/* End of main flex row */}
            {/* Back & Proceed buttons - Full width below the flex row */}
            <div className="mt-2 flex justify-between">
              {" "}
              {/* Adjusted mt for spacing */}
              <Button variant="outline" size="lg" onClick={prevStep}>
                Back
              </Button>
              {/* Attach handleSubmit to the button's onClick */}
              <Button
                size="lg"
                type="button" // Use type="button" to prevent default form submission
                onClick={methods.handleSubmit(onSubmit)} // Call handleSubmit from the form context
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? "Submitting…" : "Proceed"}
              </Button>
            </div>
          </div>{" "}
          {/* End of main container */}
        </>
      )}
    </div>
  );
}
