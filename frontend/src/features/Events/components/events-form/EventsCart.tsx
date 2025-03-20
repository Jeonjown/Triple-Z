import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RiShoppingBag3Fill } from "react-icons/ri";
// Import the unified CartItem type from your EventForm
import { CartItem } from "../../pages/EventForm";

interface GroupsCartProps {
  cart: CartItem[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  tooltipTrigger: number;
}

const QuantityInput: React.FC<{
  value: number;
  onChange: (newVal: number) => void;
}> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <input
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 999) {
          onChange(parsed);
        } else {
          // Reset to the last valid number if the value is invalid or empty
          setInputValue(value.toString());
        }
      }}
      min="1"
      max="99"
      className="w-16 rounded border text-center"
    />
  );
};

const EventsCart: React.FC<GroupsCartProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  tooltipTrigger,
}) => {
  // Calculate overall cart total
  const totalCartPrice = cart.reduce(
    (total, item) => total + item.totalPrice,
    0,
  );

  // Manage tooltip state for "Item added!"
  const [showTooltip, setShowTooltip] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (tooltipTrigger === 0) return;
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), 300);
    return () => clearTimeout(timer);
  }, [tooltipTrigger]);

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="fixed bottom-10 right-10 z-30">
          {showTooltip && (
            <div className="absolute -top-8 left-1/2 w-32 -translate-x-1/2 rounded border bg-white px-2 py-1 text-center text-sm text-text shadow-lg">
              Item added!
            </div>
          )}
          <RiShoppingBag3Fill className="size-16 rounded-full bg-secondary p-2 text-primary hover:scale-105 hover:cursor-pointer" />
          {cart.length > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cart.length}
            </Badge>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex h-1/2 flex-col">
        <DrawerHeader className="mx-auto">
          <DrawerTitle className="text-center">Orders</DrawerTitle>
        </DrawerHeader>
        <div className="flex-grow overflow-y-auto p-4 lg:px-40">
          {cart.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="mb-4 flex items-center justify-between border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded"
                />
                <div className="flex-1 px-4">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs">
                    Unit Price: ₱{item.price.toFixed(2)}
                  </p>
                  {item.size && <p className="text-xs">Size: {item.size}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      updateQuantity(item._id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(newVal) => updateQuantity(item._id, newVal)}
                  />
                  <button
                    className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-200"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <DrawerFooter className="border-t bg-white p-4">
          <div className="text-center font-bold">
            Total: ₱{totalCartPrice.toFixed(2)}
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <DrawerClose className="w-full max-w-sm">
              <Button variant={"outline"} className="w-full">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EventsCart;
