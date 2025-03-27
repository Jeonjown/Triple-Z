// GroupStep2.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import EmbeddedMenu, { MenuItem, SelectedItem } from "./EmbeddedMenu";
import GroupsCart from "./GroupsCart";
import { CartItem as UnifiedCartItem } from "../../pages/GroupForm";
import { EventFormValues } from "../../pages/EventForm";
import ScrollToTop from "@/components/ScrollToTop";

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
  selectedPackageIds: SelectedItem[];
  setSelectedPackageIds: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  quantityMap: Record<string, number>;
  setQuantityMap: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  cart: UnifiedCartItem[];
  setCart: React.Dispatch<React.SetStateAction<UnifiedCartItem[]>>;
};

const GroupStep2 = ({
  selectedPackageIds,
  setSelectedPackageIds,
  quantityMap,
  setQuantityMap,
  cart,
  setCart,
  prevStep,
  nextStep,
}: Step2Props) => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<EventFormValues>();

  // Watch partySize for dynamic error messaging and validation.
  const partySize = watch("partySize");

  const { data } = useFetchAllMenuItems();

  // State to trigger cart tooltip on add-to-cart actions.
  const [tooltipTrigger, setTooltipTrigger] = useState(0);

  // Update the cart ensuring each item includes a valid 'price' field.
  const updateCart = useCallback(() => {
    const updatedCart: UnifiedCartItem[] =
      (selectedPackageIds
        .map((selected) => {
          // Find the menu item using the original _id from the selected item.
          const menuItem = data?.find((item) => item._id === selected._id);
          if (!menuItem) return null;
          const quantity = quantityMap[selected.key] || 0;
          if (quantity < 1) return null;
          let price = 0;
          let sizeText = "";
          if (menuItem.requiresSizeSelection) {
            // Use the selected size option; default to the first option if none is chosen.
            const sizeOption =
              menuItem.sizes.find((s) => s._id === selected.sizeId) ||
              menuItem.sizes[0];
            price = sizeOption.sizePrice;
            sizeText = sizeOption.size;
          } else {
            // If no size selection is required, use the base price (or 0 if null).
            price = menuItem.basePrice !== null ? menuItem.basePrice : 0;
          }
          return {
            _id: selected.key, // Use the unique composite key for the cart item.
            title: menuItem.title,
            quantity,
            price, // Unit price
            image: menuItem.image,
            size: sizeText,
            totalPrice: quantity * price,
          };
        })
        .filter((item) => item !== null) as UnifiedCartItem[]) || [];
    setCart(updatedCart);
  }, [data, selectedPackageIds, quantityMap, setCart]);

  // Add-to-cart handler: adds the item or increases its quantity.
  const addToCart = (item: MenuItem, sizeId?: string) => {
    const key = sizeId ? `${item._id}_${sizeId}` : item._id;
    const exists = selectedPackageIds.find((s) => s.key === key);
    if (exists) {
      setQuantityMap((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    } else {
      setSelectedPackageIds([
        ...selectedPackageIds,
        { key, _id: item._id, sizeId },
      ]);
      setQuantityMap((prev) => ({ ...prev, [key]: 1 }));
    }
    updateCart();
    setTooltipTrigger((prev) => prev + 1);
  };

  const updateQuantity = (key: string, newQuantity: number) => {
    setQuantityMap((prev) => ({ ...prev, [key]: newQuantity }));
    updateCart();
  };

  const removeFromCart = (key: string) => {
    setSelectedPackageIds((prev) => prev.filter((item) => item.key !== key));
    setQuantityMap((prev) => {
      const newMap = { ...prev };
      delete newMap[key];
      return newMap;
    });
    updateCart();
  };

  useEffect(() => {
    updateCart();
  }, [selectedPackageIds, quantityMap, data, updateCart]);

  useEffect(() => {
    setValue("cart", cart);
  }, [cart, setValue]);

  useEffect(() => {
    console.log("Current Cart Data:", cart);
  }, [cart]);

  // Calculate the total quantity of items in the cart.
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine whether the Next button should be disabled.
  const nextDisabled = totalQuantity < partySize;

  return (
    <>
      <ScrollToTop />
      <EmbeddedMenu onAddToCart={addToCart} />
      <GroupsCart
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        tooltipTrigger={tooltipTrigger}
      />
      <div className="mt-4 flex gap-4">
        <Button
          type="button"
          variant={"outline"}
          onClick={prevStep}
          className="w-full"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="w-full"
          disabled={nextDisabled}
        >
          Next
        </Button>
      </div>
      {nextDisabled && (
        <p className="mt-2 text-center text-sm text-red-700">
          Your cart has {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          . Please add at least {partySize - totalQuantity} more{" "}
          {partySize - totalQuantity === 1 ? "item" : "items"} to reach your
          party size of {partySize}.
        </p>
      )}
      {errors.cart && (
        <p className="mt-2 text-center text-sm text-red-700">
          {errors.cart.message}
        </p>
      )}
    </>
  );
};

export default GroupStep2;
