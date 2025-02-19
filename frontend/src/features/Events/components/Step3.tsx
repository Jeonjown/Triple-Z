import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";
import { useCreateReservations } from "../hooks/useCreateReservations";

interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

// Step 3: Confirmation
type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  methods: UseFormReturn<EventFormValues>;
  cart: CartItem[];
};

const Step3 = ({ prevStep, nextStep, methods, cart }: Step3Props) => {
  const { mutate } = useCreateReservations();
  const eventFee = 3000;
  const { watch, handleSubmit, reset } = methods;
  const formValues = watch();

  // Format date as MM-DD-YYYY
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Submit form and process mutation
  const onSubmit = (data: EventFormValues) => {
    mutate(data, {
      onSuccess: () => {
        nextStep(); // Advance only after success
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
          <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
          <div className="text-sm text-gray-600">
            Total: ${item.totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    ));
  };

  // Calculate total price including event fee
  const calculateTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    return cartTotal + eventFee;
  };

  return (
    <>
      <ScrollToTop />
      {/* Confirmation Card */}

      <div className="mx-auto mt-8 w-full rounded-lg bg-white p-6 md:border">
        <h2 className="mb-10 text-center text-2xl font-semibold">
          Confirm Your Details
        </h2>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Full Name:</span>
            <p className="">{formValues.fullName}</p>
          </div>
          <div>
            <span className="font-semibold">Phone Number:</span>
            <p className="">{formValues.contactNumber}</p>
          </div>
          <div>
            <span className="font-semibold">Event Type:</span>
            <p className="">{formValues.eventType}</p>
          </div>
          <div>
            <span className="font-semibold">Party Size:</span>
            <p className="">{formValues.partySize}</p>
          </div>
          <div>
            <span className="font-semibold">Date:</span>
            <p className="">
              {formValues.date ? formatDate(new Date(formValues.date)) : ""}
            </p>
          </div>
          <div>
            <span className="font-semibold">Time:</span>
            <p className="">
              {formValues.startTime} - {formValues.endTime}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Special request:</span>
          <div className="mt-2 border">
            {formValues.specialRequest ?? "None"}
          </div>
        </div>

        {/* Preorder List */}
        <div className="mb-4">
          <span className="text-gray-600">Preorder List:</span>
          <div className="mt-2 rounded border">{renderCartItems()}</div>
        </div>

        {/* Fees and Total */}
        <div className="mb-4">
          <span className="text-gray-600">Event Fee:</span>
          <p className="font-semibold">₱{eventFee}</p>
        </div>
        <div className="text-right text-xl font-semibold">
          Total Price: ₱{calculateTotalPrice().toFixed(2)}
        </div>
      </div>

      {/* Navigation Buttons with original styles */}
      <div className="mt-6 flex max-w-full gap-4">
        <Button type="button" onClick={prevStep} className="flex-1">
          Previous
        </Button>
        <Button type="button" onClick={handleCheckout} className="flex-1">
          Checkout
        </Button>
      </div>
    </>
  );
};

export default Step3;
