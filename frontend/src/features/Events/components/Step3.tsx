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

  // Format the date in MM-DD-YYYY format
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Converts military time to 12-hour format (AM/PM)
  const militaryToStandard = (militaryTime: string | undefined): string => {
    if (!militaryTime) return "";
    const parts = militaryTime.split(":");
    let hour: number = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm: string = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // 12:00 AM/PM case
    return `${hour}:${minute} ${ampm}`;
  };

  // Handles form submission
  const onSubmit = (data: EventFormValues) => {
    // Call mutate to submit the data
    console.log(data);
    mutate(data);
  };

  // Handles checkout action (submitting the form and moving to the next step)
  const handleCheckout = () => {
    console.log("submitted step 3");
    handleSubmit(onSubmit)(); // Triggers the mutation
    nextStep(); // Move to next step
    reset(); // Reset the form after submission
  };

  // Renders the cart items in the preorder list
  const renderCartItems = () => {
    if (cart.length === 0) {
      return <div>No items in your cart.</div>;
    }

    return cart.map((item) => (
      <div key={item._id} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={item.image}
            alt={item.title}
            className="h-20 w-20 object-cover"
          />
          <div>
            <div className="font-semibold">{item.title}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Total Price: ${item.totalPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>
    ));
  };

  // Calculate the total price of all items in the cart
  const calculateTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    return cartTotal + eventFee;
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-5 rounded-sm border p-8">
        <div className="text-text">Full Name:</div>
        <div className="font-semibold">{formValues.fullName}</div>
        <div className="text-text">Phone Number:</div>
        <div className="font-semibold">{formValues.contactNumber}</div>
        <div className="text-text">Event Type:</div>
        <div className="font-semibold">{formValues.eventType}</div>
        <div className="text-text">Party Size:</div>
        <div className="font-semibold">{formValues.partySize}</div>
        <div className="text-text">Date:</div>
        <div className="font-semibold">
          {formValues.date ? formatDate(new Date(formValues.date)) : ""}
        </div>
        <div className="text-text">Time:</div>
        <div className="font-semibold">
          <span>{militaryToStandard(formValues.startTime)}</span> -{" "}
          <span>{militaryToStandard(formValues.endTime)}</span>
        </div>
        <div className="text-text">Preorder List:</div>
        <div className="font-semibold text-text">{renderCartItems()}</div>
        <span className="text-text">Event Fee:</span>
        <div className="font-semibold">₱{eventFee}</div>

        {/* Display the total price of the cart */}
        <div className="mt-4 font-semibold">
          Total Price: ₱{calculateTotalPrice().toFixed(2)}
        </div>
      </div>
      <div className="mt-5 flex gap-4">
        <Button type="button" onClick={prevStep} className="w-full">
          Previous
        </Button>
        <Button type="submit" onClick={handleCheckout} className="w-full">
          Checkout
        </Button>
      </div>
    </>
  );
};

export default Step3;
