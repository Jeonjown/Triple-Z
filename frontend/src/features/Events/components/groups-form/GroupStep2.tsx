import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import { useFormContext } from "react-hook-form";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import { EventFormValues } from "../../pages/EventForm";
import EmbeddedMenu, { SelectedItem } from "./EmbeddedMenu";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
  size?: string; // size text (if applicable)
};

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
  } = useFormContext<EventFormValues>();
  const { data } = useFetchAllMenuItems();
  console.log(data);

  // Update the cart whenever data, selected items, or quantities change.
  const updateCart = useCallback(() => {
    const updatedCart: CartItem[] =
      (data
        ?.filter((item) => selectedPackageIds.some((s) => s.id === item._id!))
        .map((item) => {
          const selected = selectedPackageIds.find((s) => s.id === item._id!);
          const quantity = quantityMap[item._id!] || 1;
          // If quantity is 0, remove the item.
          if (quantity < 1) return null;
          let price = 0;
          let sizeText = "";
          if (item.requiresSizeSelection) {
            // Find the size option that matches the selected sizeId or default to first option.
            const sizeId = selected?.sizeId;
            const sizeOption =
              item.sizes.find((s) => s._id === sizeId) || item.sizes[0];
            price = sizeOption.sizePrice;
            sizeText = sizeOption.size;
          } else {
            price = item.basePrice || 0;
          }
          return {
            _id: item._id!,
            title: item.title,
            quantity,
            totalPrice: quantity * price,
            image: item.image,
            size: sizeText,
          };
        })
        .filter((item) => item !== null) as CartItem[]) || [];
    setCart(updatedCart);
  }, [data, selectedPackageIds, quantityMap, setCart]);

  // Handle quantity change for a cart item.
  const handleQuantityChange = (id: string, increment: boolean) => {
    const currentQty = quantityMap[id] || 1;
    const updatedQuantity = increment
      ? currentQty + 1
      : Math.max(1, currentQty - 1);
    setQuantityMap((prev) => ({ ...prev, [id]: updatedQuantity }));
    updateCart();
  };

  useEffect(() => {
    updateCart();
  }, [selectedPackageIds, quantityMap, data, updateCart]);

  useEffect(() => {
    setValue("cart", cart);
  }, [cart, setValue]);

  return (
    <>
      <ScrollToTop />

      {/* Integrated Embedded Menu */}
      <EmbeddedMenu onSelectionChange={setSelectedPackageIds} />

      {/* Pre Order Section as a compact receipt-like list (without description) */}
      <p className="mb-2 mt-4 text-lg font-semibold">Pre Order</p>
      <div className="w-full rounded-md border bg-muted p-4 px-10">
        {cart.map((item) => (
          <div key={item._id} className="border-b py-2 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-gray-800">
                {item.title}
                {item.size && (
                  <span className="ml-1 text-sm font-normal text-gray-600">
                    ({item.size})
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                ₱{item.totalPrice.toFixed(2)}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                className="h-6 w-6 p-0"
                onClick={() => handleQuantityChange(item._id, false)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <input
                type="number"
                min="1"
                value={quantityMap[item._id] || 1}
                onChange={(e) => {
                  const newQuantity = Math.max(1, Number(e.target.value));
                  setQuantityMap((prev) => ({
                    ...prev,
                    [item._id!]: newQuantity,
                  }));
                }}
                className="w-12 rounded border text-center text-sm"
              />
              <Button
                type="button"
                className="h-6 w-6 p-0"
                onClick={() => handleQuantityChange(item._id, true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="ml-auto mr-2 mt-3 text-lg font-semibold text-primary">
        Overall Total: ₱
        {cart.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)}
      </div>

      <div className="mt-4 flex gap-4">
        <Button type="button" onClick={prevStep} className="w-full">
          Previous
        </Button>
        <Button type="button" onClick={nextStep} className="w-full">
          Next
        </Button>
      </div>
      {errors.cart && (
        <p className="mt-2 text-xs text-red-500">{errors.cart.message}</p>
      )}
    </>
  );
};

export default GroupStep2;
