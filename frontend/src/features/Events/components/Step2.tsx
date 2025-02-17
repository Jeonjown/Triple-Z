import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import { Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ScrollToTop from "@/components/ScrollToTop";
import { useCallback, useEffect } from "react";

type CartItem = {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
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
  const { data } = useFetchAllMenuItems();

  // Update the cart whenever selected items or quantities change
  const updateCart = useCallback(() => {
    const updatedCart: CartItem[] =
      data
        ?.filter((item) => selectedPackageIds.includes(item._id ?? ""))
        .map((item) => ({
          _id: item._id ?? "",
          title: item.title,
          quantity: quantityMap[item._id ?? ""] || 1, // Default quantity is 1
          totalPrice:
            (quantityMap[item._id ?? ""] || 1) * (item.basePrice || 0),
          image: item.image,
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
      setQuantityMap({ ...quantityMap, [value]: 1 });
    }

    updateCart();
  };

  // Handle quantity change
  const handleQuantityChange = (id: string, increment: boolean) => {
    const updatedQuantity = increment
      ? (quantityMap[id] || 1) + 1
      : Math.max(1, (quantityMap[id] || 1) - 1);

    setQuantityMap({ ...quantityMap, [id]: updatedQuantity });
    updateCart();
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
    updateCart();
  }, [updateCart]);

  return (
    <>
      <ScrollToTop />
      <div className="mb-2 mt-5">Package</div>
      <div className="space-y-2">{renderMenuItems("Event Meals")}</div>
      <div className="mb-2 mt-5 font-semibold">Additionals</div>
      <div className="space-y-2">{renderMenuItems("Event Additionals")}</div>

      <p className="mb-2 mt-5">Pre Order</p>
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
                Price: ${item.totalPrice.toFixed(2)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleQuantityChange(item._id, false)}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleQuantityChange(item._id, true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 text-base font-semibold text-gray-800">
                Total Price: ${item.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-lg font-semibold text-primary">
        Overall Total: ${getOverallTotal().toFixed(2)}
      </div>

      <label className="mb-2 mt-5">Notes</label>
      <Textarea
        placeholder="Special Request"
        className="block w-full rounded-md border p-10 focus:outline-none"
      />
      <div className="mt-5 flex gap-4">
        <Button type="button" onClick={prevStep}>
          Previous
        </Button>
        <Button type="button" onClick={nextStep}>
          Next
        </Button>
      </div>
    </>
  );
};

export default Step2;
