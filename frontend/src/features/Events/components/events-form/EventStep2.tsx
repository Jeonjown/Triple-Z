import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import EmbeddedMenu, { MenuItem, SelectedItem } from "./EmbeddedMenu";
import ScrollToTop from "@/components/ScrollToTop";
import EventsCart from "./EventsCart"; // Your custom cart component
import { CartItem, EventFormValues } from "../../pages/EventForm";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

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

  // Get settings to read the required minimum package order.
  const { data: settings } = useGetEventReservationSettings();

  // Calculate total packages ordered.
  const totalPackagesOrdered = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

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

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <Button type="button" onClick={prevStep} className="w-full">
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
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
