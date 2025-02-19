import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import { Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ScrollToTop from "@/components/ScrollToTop";
import { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../pages/EventForm";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
  description?: string;
};

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
  selectedPackageIds: string[];
  setSelectedPackageIds: React.Dispatch<React.SetStateAction<string[]>>;
  quantityMap: Record<string, number>;
  setQuantityMap: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const Step2 = ({
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
  } = useFormContext<EventFormValues>();

  const { data } = useFetchAllMenuItems();
  const { setValue, register } = useFormContext<EventFormValues>();
  // Update the cart whenever selected items or quantities change
  const updateCart = useCallback(() => {
    const updatedCart: CartItem[] =
      data
        ?.filter((item) => selectedPackageIds.includes(item._id ?? ""))
        .map((item) => ({
          _id: item._id ?? "",
          title: item.title,
          quantity: quantityMap[item._id ?? ""] || 1,
          totalPrice:
            (quantityMap[item._id ?? ""] || 1) * (item.basePrice || 0),
          image: item.image,
          description: item.description,
        })) || [];

    setCart(updatedCart);
  }, [data, setCart, selectedPackageIds, quantityMap]);

  // Handle package selection toggle and quantity update
  const handleSelect = (value: string) => {
    const updatedSelection = selectedPackageIds.includes(value)
      ? selectedPackageIds.filter((id) => id !== value)
      : [...selectedPackageIds, value];

    setSelectedPackageIds(updatedSelection);

    if (!quantityMap[value]) {
      setQuantityMap((prev) => ({ ...prev, [value]: 1 }));
    }

    updateCart(); // Ensure cart is updated
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    const updatedQuantity = increment
      ? (quantityMap[id] || 1) + 1
      : Math.max(1, (quantityMap[id] || 1) - 1);

    setQuantityMap((prev) => ({ ...prev, [id]: updatedQuantity }));
    updateCart(); // Ensure cart is updated after quantity change
  };

  // Get overall total from the cart
  const getOverallTotal = () =>
    cart.reduce((total, item) => total + item.totalPrice, 0);

  // Render menu items for a specific subcategory
  const renderMenuItems = (subcategory: string) =>
    data
      ?.filter((item) => item.subcategoryName === subcategory)
      .map((menuItem) => (
        <div key={menuItem._id} className="flex items-center gap-2">
          <Checkbox
            id={menuItem._id}
            checked={selectedPackageIds.includes(menuItem._id!)}
            onCheckedChange={() => handleSelect(menuItem._id!)}
          />
          <label htmlFor={menuItem._id}>{menuItem.title}</label>
        </div>
      ));

  useEffect(() => {
    updateCart(); // Update the cart based on selectedPackageIds and quantityMap
  }, [selectedPackageIds, quantityMap, updateCart]);

  useEffect(() => {
    setValue("cart", cart); // Update form state with the cart
  }, [cart, setValue]); // This effect will trigger only when cart changes

  return (
    <>
      <ScrollToTop />
      <div className="md:flex">
        <div className="flex-1">
          <div className="mb-2 mt-5 font-semibold">Packages</div>
          <div className="space-y-2">{renderMenuItems("Event Meals")}</div>
        </div>
        <div className="flex-1">
          <div className="mb-2 mt-5 font-semibold">Additionals</div>
          <div className="space-y-2">
            {renderMenuItems("Event Additionals")}
          </div>
        </div>
      </div>

      <p className="mb-2 mt-5 font-semibold">Pre Order</p>
      <div className="block w-full rounded-md border bg-[#F8F8F8] p-8">
        {cart.map((item) => (
          <div key={item._id} className="mb-6 flex items-start gap-4">
            <img
              src={item.image}
              alt={`${item.title} image`}
              className="h-24 w-24 rounded-md object-cover shadow-md"
            />
            <div className="flex flex-col justify-between">
              <div className="text-xl font-semibold">{item.title}</div>
              <div className="mt-2 text-sm font-medium text-gray-800">
                Price: ₱{item.totalPrice.toFixed(2)}
              </div>
              {item.description && (
                <p className="mt-1 max-w-prose text-sm text-gray-600">
                  {item.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <Button
                  type="button"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(item._id, false)}
                >
                  <Minus className="!size-3" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  type="button"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(item._id, true)}
                >
                  <Plus className="!size-3" />
                </Button>
              </div>

              <div className="mt-2 text-base font-semibold text-gray-800">
                Total Price: ₱{item.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-lg font-semibold text-primary">
        Overall Total: ₱{getOverallTotal().toFixed(2)}
      </div>

      <label className="mb-2 mt-5">Notes</label>
      <Textarea
        placeholder="Special Request"
        className="block w-full rounded-md border p-10 focus:outline-none"
        {...register("specialRequest")}
      />
      <div className="mt-5 flex gap-4">
        <Button type="button" onClick={prevStep} className="w-full">
          Previous
        </Button>
        <Button type="button" onClick={nextStep} className="w-full">
          Next
        </Button>
      </div>
      {/* Display error message for the cart if validation fails */}
      {errors.cart && (
        <p className="mt-2 text-sm text-red-500">{errors.cart.message}</p>
      )}
    </>
  );
};

export default Step2;
