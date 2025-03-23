import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import EmbeddedMenu, { MenuItem, SelectedItem } from "./EmbeddedMenu";
import ScrollToTop from "@/components/ScrollToTop";
import EventsCart from "./EventsCart"; // Your custom cart component
import { CartItem, EventFormValues } from "../../pages/EventForm";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { Info, AlertCircle } from "lucide-react";
// Import shad cn Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
  selectedPackageIds: SelectedItem[];
  setSelectedPackageIds: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  quantityMap: Record<string, number>;
  setQuantityMap: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const EventStep2: React.FC<Step2Props> = ({
  selectedPackageIds,
  setSelectedPackageIds,
  quantityMap,
  setQuantityMap,
  cart,
  setCart,
  prevStep,
  nextStep,
}) => {
  const {
    formState: { errors },
    setValue,
    register,
    trigger,
  } = useFormContext<EventFormValues>();

  // Reset tooltip trigger on mount so it doesn't carry over from other steps.
  const [tooltipTrigger, setTooltipTrigger] = useState<number>(0);
  useEffect(() => {
    setTooltipTrigger(0);
  }, []);

  // Function to add an item to cart
  const addToCart = (item: MenuItem, sizeId?: string) => {
    const key = sizeId ? `${item._id}_${sizeId}` : item._id;
    const exists = selectedPackageIds.find((s) => s.key === key);

    if (exists) {
      const newQuantity = (quantityMap[key] || 1) + 1;
      setQuantityMap((prev) => ({ ...prev, [key]: newQuantity }));
      setCart((prevCart) =>
        prevCart.map((ci) =>
          ci._id === key
            ? {
                ...ci,
                quantity: newQuantity,
                totalPrice: newQuantity * ci.price,
              }
            : ci,
        ),
      );
    } else {
      setSelectedPackageIds([
        ...selectedPackageIds,
        { key, _id: item._id, sizeId },
      ]);
      setQuantityMap((prev) => ({ ...prev, [key]: 1 }));
      let price = item.basePrice !== null ? item.basePrice : 0;
      let sizeText = "";
      if (item.requiresSizeSelection && item.sizes.length > 0) {
        const sizeOption =
          item.sizes.find((s) => s._id === sizeId) || item.sizes[0];
        price = sizeOption.sizePrice;
        sizeText = sizeOption.size;
      }
      const newCartItem: CartItem = {
        _id: key,
        title: item.title,
        quantity: 1,
        price,
        totalPrice: price,
        image: item.image,
        size: sizeText || undefined,
      };
      setCart((prev) => [...prev, newCartItem]);
    }
    // Increment the tooltip trigger when an item is added
    setTooltipTrigger((prev) => prev + 1);
  };

  // Update form state when cart changes
  useEffect(() => {
    setValue("cart", cart);
  }, [cart, setValue]);

  // Get settings for minimum package order and fee values.
  const { data: settings } = useGetEventReservationSettings();

  // Calculate total packages ordered.
  const totalPackagesOrdered = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // Next button handler: validate that the corkage field is answered
  const handleNext = async () => {
    const valid = await trigger("isCorkage");
    if (!valid) return;
    nextStep();
  };

  return (
    <>
      <ScrollToTop />
      {/* EmbeddedMenu for adding items */}
      <EmbeddedMenu onAddToCart={addToCart} />

      {/* Display the cart with tooltip triggered only on add-to-cart events */}
      <EventsCart
        cart={cart}
        updateQuantity={(key, newQuantity) => {
          setQuantityMap((prev) => ({ ...prev, [key]: newQuantity }));
          setCart((prevCart) =>
            prevCart.map((item) =>
              item._id === key
                ? {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * item.price,
                  }
                : item,
            ),
          );
        }}
        removeFromCart={(key) => {
          setSelectedPackageIds((prev) =>
            prev.filter((item) => item.key !== key),
          );
          setQuantityMap((prev) => {
            const newMap = { ...prev };
            delete newMap[key];
            return newMap;
          });
          setCart((prev) => prev.filter((item) => item._id !== key));
        }}
        tooltipTrigger={tooltipTrigger}
      />

      {/* Special Request field placed outside the menu */}
      <div className="mt-6">
        <label className="mb-2 block font-medium text-gray-700">
          Special Request
        </label>
        <textarea
          {...register("specialRequest")}
          placeholder="Any special requests?"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
        ></textarea>
        {errors.specialRequest && (
          <p className="mt-2 text-center text-sm text-red-500">
            {errors.specialRequest.message}
          </p>
        )}
      </div>

      {/* Corkage Fee Radio Button Group with Tooltip and Error Icon */}
      <div className="mt-6">
        <div className="flex items-center">
          <label className="font-medium text-gray-700">Corkage Fee</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-2 h-4 w-4 cursor-pointer text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="px-2 py-1 text-xs">
                Corkage is a fee of ₱{settings?.eventCorkageFee ?? 500} charged
                when bringing outside food or drinks.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="mt-2 flex space-x-4 text-sm">
          {/* Yes option: value "true" */}
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="true"
              // Register radio with required validation
              {...register("isCorkage", {
                required: "Please select an option",
              })}
              className="form-radio h-4 w-4 text-primary"
            />
            <span>
              Yes (A ₱{settings?.eventCorkageFee ?? 500} corkage fee applies)
            </span>
          </label>
          {/* No option: value "false" */}
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="false"
              {...register("isCorkage", {
                required: "Please select an option",
              })}
              className="form-radio h-4 w-4 text-primary"
            />
            <span>No, I don’t have outside food</span>
          </label>
        </div>
        {errors.isCorkage && (
          <div className="mt-2 flex items-center justify-center">
            <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
            <p className="text-sm text-red-500">{errors.isCorkage.message}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <Button type="button" onClick={prevStep} className="w-full">
          Previous
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="w-full"
          disabled={
            settings
              ? totalPackagesOrdered < settings.eventMinPackageOrder
              : false
          }
        >
          Next
        </Button>
      </div>
      {settings && totalPackagesOrdered < settings.eventMinPackageOrder && (
        <p className="mt-2 text-center text-sm text-red-500">
          Minimum package order of {settings.eventMinPackageOrder} is required.
        </p>
      )}
      {errors.cart && (
        <p className="mt-2 text-center text-sm text-red-500">
          {errors.cart.message}
        </p>
      )}
    </>
  );
};

export default EventStep2;
