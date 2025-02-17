import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";

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
  cart: CartItem[]; // Specify the type of cart
};

const Step3 = ({ prevStep, nextStep, methods, cart }: Step3Props) => {
  const { watch, handleSubmit } = methods;
  const formValues = watch();

  // Formats the date in MM-DD-YYYY format
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
    if (parts.length < 2) return militaryTime;
    let hour: number = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm: string = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Handles form submission
  const onSubmit = (data: EventFormValues) => {
    console.log("Form submitted with data:", data);
  };

  // Handles checkout action (moving to the next step)
  const handleCheckout = () => {
    nextStep();
    handleSubmit(onSubmit)();
  };

  // Renders the preorder cart items
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
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-5 rounded-sm border p-8">
        <div className="text-text">Full Name:</div>
        <div className="font-semibold">{formValues.fullName}</div>
        <div className="text-text">Phone Number:</div>
        <div className="font-semibold">{formValues.phoneNumber}</div>
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
        <div>{renderCartItems()}</div>

        {/* Display the total price of the cart */}
        <div className="mt-4 font-semibold">
          Total Price: ${calculateTotalPrice().toFixed(2)}
        </div>
      </div>
      <div className="mt-5 flex gap-4">
        <Button type="button" onClick={prevStep}>
          Previous
        </Button>
        <Button type="button" onClick={handleCheckout}>
          Checkout
        </Button>
      </div>
    </>
  );
};

export default Step3;
