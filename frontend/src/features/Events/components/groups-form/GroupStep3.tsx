import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ScrollToTop from "@/components/ScrollToTop";
import { useServiceworker } from "@/features/Notifications/hooks/useServiceWorker";
import { UseFormReturn } from "react-hook-form";
import { CartItem, GroupFormValues } from "../../pages/GroupForm";
import { useCreateGroupReservation } from "../../hooks/useCreateGroupReservation";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  methods: UseFormReturn<GroupFormValues>;
  cart: CartItem[];
};

const GroupStep3 = ({ prevStep, nextStep, methods, cart }: Step3Props) => {
  const { registerAndSubscribe } = useServiceworker();
  const { mutate } = useCreateGroupReservation();
  const { watch, handleSubmit, reset } = methods;
  const formValues = watch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current form values:", formValues);
  }, [formValues]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const onSubmit = (data: GroupFormValues) => {
    console.log("onSubmit triggered with data:", data);
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

  const handleCheckout = () => {
    handleSubmit(onSubmit)();
  };

  const handleCheckoutFlow = async () => {
    try {
      if (Notification.permission === "granted") {
        const registration = await navigator.serviceWorker.getRegistration("/");
        if (registration) {
          const existingSubscription =
            await registration.pushManager.getSubscription();
          if (existingSubscription) {
            handleCheckout();
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
    setDialogOpen(true);
  };

  // Renders cart items and adds unit price display.
  const renderCartItems = () => {
    if (cart.length === 0) return <div>No items in your cart.</div>;
    return cart.map((item) => {
      // Calculate the single price (unit price) based on totalPrice divided by quantity.

      return (
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
              Quantity: {item.quantity} x ₱{item.price.toFixed(2)}
            </div>

            <div className="text-sm text-gray-600">
              Total: ₱{item.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      );
    });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
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
          <span className="text-xl font-semibold text-primary">
            Preorder List:
          </span>
          <div className="mt-2 rounded border p-2">{renderCartItems()}</div>
        </div>
        <div className="text-right text-xl font-semibold">
          Total Price: ₱{calculateTotalPrice().toFixed(2)}
        </div>
      </div>
      <div className="mt-6 flex max-w-full gap-4">
        <Button type="button" onClick={prevStep} className="flex-1">
          Previous
        </Button>
        <Button type="button" onClick={handleCheckoutFlow} className="flex-1">
          Checkout
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications?</DialogTitle>
            <DialogDescription>
              Would you like to receive push notification for order updates on
              this device?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                handleCheckout();
              }}
            >
              No, proceed
            </Button>
            <Button
              onClick={async () => {
                setDialogOpen(false);
                await registerAndSubscribe();
                handleCheckout();
              }}
            >
              Yes, subscribe me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupStep3;
