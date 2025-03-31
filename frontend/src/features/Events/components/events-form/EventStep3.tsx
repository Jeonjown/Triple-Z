import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";
import { useCreateEventReservations } from "../../hooks/useCreateEventReservations";
import { useGetEventReservationSettings } from "../../hooks/useGetEventReservationSettings";
import { Check } from "lucide-react";

interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
}

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  methods: UseFormReturn<EventFormValues>;
  cart: CartItem[];
};

const EventStep3 = ({ prevStep, nextStep, methods, cart }: Step3Props) => {
  const { data: settings } = useGetEventReservationSettings();
  const { mutate } = useCreateEventReservations();
  const { watch, handleSubmit, reset } = methods;
  const formValues = watch();
  const isCorkageSelected = formValues.isCorkage === "true";

  // State for notification and TOS dialogs.
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  // Flag to mark TOS acceptance.
  const [acceptedTOS, setAcceptedTOS] = useState(false);
  // New state to check if the user has scrolled to the bottom.
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  // Ref for the TOS content container.
  const tosContentRef = useRef<HTMLDivElement>(null);

  // Format a date as MM-DD-YYYY for display.
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Calculate the total price including event fee and corkage fee (if selected).
  const calculateTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    const eventFee = settings?.eventFee ?? 0;
    const corkageFee = isCorkageSelected ? (settings?.eventCorkageFee ?? 0) : 0;
    return cartTotal + eventFee + corkageFee;
  };

  // Submit form and process the mutation.
  const onSubmit = (data: EventFormValues) => {
    mutate(data, {
      onSuccess: () => {
        nextStep();
        reset();
      },
      onError: (error) => {
        console.error("Error creating reservation:", error);
      },
    });
  };

  // Trigger form submission.
  const handleCheckout = () => {
    handleSubmit(onSubmit)();
  };

  // Render each cart item.
  const renderCartItems = () => {
    if (cart.length === 0) return <div>No items in your cart.</div>;
    return cart.map((item) => (
      <div
        key={item._id}
        className="flex items-center gap-4 border-b p-2 last:border-b-0"
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-16 w-16 rounded object-cover"
        />
        <div>
          <div className="font-semibold">{item.title}</div>
          <div className="text-sm text-gray-600">
            {item.quantity} x ₱{item.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Total: ₱{item.totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    ));
  };

  // Handler to check if user scrolled to the bottom of the TOS content.
  const handleTosScroll = () => {
    if (tosContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tosContentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="mx-auto mt-8 w-full rounded-lg bg-white p-6 md:border">
        <h2 className="mb-10 text-center text-2xl font-semibold">
          Confirm Your Details
        </h2>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Full Name:</span>
            <p>{formValues.fullName}</p>
          </div>
          <div>
            <span className="font-semibold">Phone Number:</span>
            <p>{formValues.contactNumber}</p>
          </div>
          <div>
            <span className="font-semibold">Event Type:</span>
            <p>{formValues.eventType}</p>
          </div>
          <div>
            <span className="font-semibold">Party Size:</span>
            <p>{formValues.partySize}</p>
          </div>
          <div>
            <span className="font-semibold">Date:</span>
            <p>
              {formValues.date ? formatDate(new Date(formValues.date)) : ""}
            </p>
          </div>
          <div>
            <span className="font-semibold">Time:</span>
            <p>
              {formValues.startTime} - {formValues.endTime}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Special Request:</span>
          <div className="mt-2 border p-2">
            {formValues.specialRequest || "None"}
          </div>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">Preorder List:</span>
          <div className="mt-2 rounded border p-2">{renderCartItems()}</div>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">Event Fee:</span>
          <p className="font-semibold">₱{settings?.eventFee}</p>
        </div>
        {isCorkageSelected && (
          <div className="mb-4">
            <span className="text-gray-600">Corkage Fee:</span>
            <p className="font-semibold">₱{settings?.eventCorkageFee}</p>
          </div>
        )}
        <div className="text-right text-xl font-semibold">
          Total Price: ₱{calculateTotalPrice().toFixed(2)}
        </div>
        {/* Instead of a simple checkbox, force the user to read the TOS */}
        <div className="mx-auto mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTosDialogOpen(true);
              setHasScrolledToBottom(false); // reset scroll flag
            }}
          >
            Read Terms of Service
          </Button>
          {acceptedTOS && (
            <div className="flex space-x-2 text-green-500">
              <span className="font-semibold">TOS Accepted</span>
              <Check />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex max-w-full gap-4">
        <Button
          type="button"
          variant={"outline"}
          onClick={prevStep}
          className="flex-1"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => setNotifDialogOpen(true)}
          className="flex-1"
          disabled={!acceptedTOS} // Disable checkout until TOS is accepted
        >
          Checkout
        </Button>
      </div>

      {/* Notification Dialog */}
      <Dialog open={notifDialogOpen} onOpenChange={setNotifDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications?</DialogTitle>
            <DialogDescription>
              Would you like to receive push notifications for order updates on
              this device?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNotifDialogOpen(false);
                handleCheckout();
              }}
            >
              No, proceed
            </Button>
            <Button
              onClick={() => {
                setNotifDialogOpen(false);
                handleCheckout();
              }}
            >
              Yes, subscribe me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={tosDialogOpen} onOpenChange={setTosDialogOpen}>
        <DialogContent
          className="max-h-[80vh] w-full max-w-md overflow-y-auto"
          ref={tosContentRef}
          onScroll={handleTosScroll}
        >
          <DialogHeader>
            <DialogTitle className="text-center">Terms of Service</DialogTitle>
            <DialogDescription className="whitespace-pre-wrap">
              {settings?.eventTermsofService || "No Terms of Service provided."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                // Allow acceptance only if the user has scrolled to the bottom.
                if (hasScrolledToBottom) {
                  setAcceptedTOS(true);
                  setTosDialogOpen(false);
                }
              }}
              disabled={!hasScrolledToBottom}
            >
              I Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventStep3;
