import { useState } from "react";
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
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  const [acceptedTOS, setAcceptedTOS] = useState(false);

  // Format date as MM-DD-YYYY
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Calculate total price including event fee.
  const calculateTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    return cartTotal + (settings?.eventFee ?? 0);
  };

  // Submit form and process mutation
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

  // Trigger form submission
  const handleCheckout = () => {
    handleSubmit(onSubmit)();
  };

  // Render cart items
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
          <span className="font-semibold">Special request:</span>
          <div className="mt-2 border p-2">
            {formValues.specialRequest ?? "None"}
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
        <div className="text-right text-xl font-semibold">
          Total Price: ₱{calculateTotalPrice().toFixed(2)}
        </div>
        {/* TOS acceptance checkbox */}
        <div className="mx-auto mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={acceptedTOS}
            onChange={(e) => setAcceptedTOS(e.target.checked)}
            className="h-4 w-4 bg-primary"
          />
          <span className="text-sm">
            I agree to Triple Z's{" "}
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => setTosDialogOpen(true)}
            >
              Terms of Service
            </button>
          </span>
        </div>
      </div>

      <div className="mt-6 flex max-w-full gap-4">
        <Button type="button" onClick={prevStep} className="flex-1">
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => setNotifDialogOpen(true)}
          className="flex-1"
          disabled={!acceptedTOS}
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
              onClick={async () => {
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Terms of Service</DialogTitle>
            <DialogDescription style={{ whiteSpace: "pre-wrap" }}>
              {settings?.eventTermsofService || "No Terms of Service provided."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setAcceptedTOS(true);
                setTosDialogOpen(false);
              }}
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
