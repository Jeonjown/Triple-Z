import { Button } from "@/components/ui/button";
import { useCartStore } from "../stores/useCartStore";
// import useAuthStore from "@/features/Auth/stores/useAuthStore";
// import Login from "../../Auth/pages/Login";
import { Link } from "react-router-dom";

const OrderCheckout = () => {
  // const { user } = useAuthStore();
  const { cart } = useCartStore();

  // if (!user) {
  //   return (
  //     <Login
  //       text="Welcome! Please log in to proceed with your order."
  //       destination="/menu/order-checkout"
  //     />
  //   );
  // }

  return (
    <div className="flex min-h-screen items-center justify-center px-2 py-8">
      <div className="w-full max-w-lg overflow-hidden rounded-md border bg-white shadow-md">
        <div className="border-b px-6 py-4">
          <h2 className="text-center text-lg font-semibold text-gray-800">
            Order Checkout
          </h2>
        </div>
        <div className="p-6">
          {Array.isArray(cart) && cart.length > 0 ? (
            <div className="mb-4 max-h-[400px] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-2 last:border-b-0"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mr-4 h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₱{item.price}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      ₱{item.quantity * item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              Your cart is empty.
            </p>
          )}

          <div className="border-t py-4">
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total:</span>
              <span>
                ₱
                {cart.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0,
                )}
              </span>
            </div>
          </div>

          <Button asChild className="mt-4 w-full">
            <Link to="/menu/generate-receipt">Place Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
