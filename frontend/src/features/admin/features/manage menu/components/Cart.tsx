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
import { useCartStore } from "../stores/useCartStore";
import useScrollBehavior from "@/components/use-scroll-behavior";
import { useState } from "react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const [open, setOpen] = useState(false);
  useScrollBehavior(open);
  // Compute total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="fixed bottom-10 right-10">
          <RiShoppingBag3Fill className="size-12 rounded-full bg-secondary p-2 text-primary hover:scale-105 hover:cursor-pointer" />
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
                key={item.id}
                className="mb-4 flex items-center justify-between border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded"
                />
                <div className="flex-1 px-4">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs">₱{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity === 1} // Disable when quantity is 1
                  >
                    -
                  </button>

                  <span className="text-sm">{item.quantity}</span>
                  <button
                    className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-200"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
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
            Total: ₱{totalPrice.toFixed(2)}
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <Button className="w-full max-w-sm">Checkout</Button>
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

export default Cart;
