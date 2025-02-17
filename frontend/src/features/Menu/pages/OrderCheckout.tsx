import { Button } from "@/components/ui/button";
import { useCartStore } from "../stores/useCartStore";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import Login from "../../Auth/pages/Login";

const OrderCheckout = () => {
  const { user } = useAuthStore();
  const { cart } = useCartStore();

  if (!user) {
    return (
      <Login
        text="Welcome! Please log in to proceed with your order."
        destination="/menu/order-checkout"
      />
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Order Checkout
        </h2>

        {Array.isArray(cart) && cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₱{item.price}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">₱{item.quantity * item.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>
            ₱
            {cart.reduce(
              (total, item) => total + item.quantity * item.price,
              0,
            )}
          </span>
        </div>

        <Button className="mt-6 w-full">Place Order</Button>
      </div>
    </div>
  );
};

export default OrderCheckout;
