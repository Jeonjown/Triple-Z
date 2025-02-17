import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchMenuItem } from "../hooks/useFetchMenuItem";
import LoadingPage from "@/pages/LoadingPage";
import { Button } from "@/components/ui/button";
import Cart from "./Cart";
import { useCartStore } from "../stores/useCartStore";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SizeType {
  _id: string;
  size: string;
  sizePrice: number;
}

// interface MenuItemType {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   basePrice: number;
//   category?: { _id: string };
//   subcategory?: { _id: string; subcategory: string };
//   sizes?: SizeType[];
// }

const MenuItem = () => {
  const { toast } = useToast();
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const {
    data: menuItem,
    isPending,
    isError,
    error,
  } = useFetchMenuItem(menuItemId!);

  const addToCart = useCartStore((state) => state.addToCart);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);

  useEffect(() => {
    if (menuItem?.sizes?.length) {
      setSelectedSize(menuItem.sizes[0]);
    }
  }, [menuItem]);

  if (isPending) return <LoadingPage />;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  const handleAddToCart = () => {
    if (!menuItem || !menuItem.image) {
      console.error("Error: Image is required for the cart item.");
      return;
    }

    const price = selectedSize?.sizePrice ?? menuItem.basePrice;
    if (price === undefined || price === null) {
      throw new Error("Error: Price is required for the cart item.");
    }
    if (price === undefined) {
      console.error("Error: Price is required for the cart item.");
      return;
    }

    const itemToAdd = {
      id: `${selectedSize?._id || `${menuItem._id}`}`,
      title: menuItem.title,
      price,
      quantity,
      image: menuItem.image,
      size: selectedSize?.size || "Default",
    };

    addToCart(itemToAdd);

    toast({
      title: "Added to cart",
      description: `${quantity} × ${menuItem.title} (${selectedSize?.size || "Default"}) - ₱${price.toFixed(2)}`,
    });
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      <Breadcrumb>
        <BreadcrumbList className="mx-2 my-2 text-base font-semibold md:text-base">
          <BreadcrumbItem>
            <BreadcrumbLink href="/menu">Menu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/menu/categories/${menuItem.category?._id}/subcategories/${menuItem.subcategory?._id}`}
            >
              {menuItem.subcategory?.subcategory}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold">
              {menuItem.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto max-w-4xl rounded-lg p-6 lg:mt-10 lg:rounded-lg lg:border lg:shadow-md">
        <div className="grid gap-6 text-center md:grid-cols-2 md:items-center lg:text-left">
          <div className="flex justify-center">
            <img
              src={menuItem.image}
              alt={menuItem.title}
              className="w-full max-w-xs rounded-lg object-cover shadow-md md:max-w-sm lg:max-w-full"
            />
          </div>

          <div className="flex flex-col justify-center lg:px-16">
            <h2 className="text-2xl font-bold md:text-3xl">{menuItem.title}</h2>
            <p className="mt-3 text-gray-700 md:text-lg">
              {menuItem.description}
            </p>

            <div className="mt-4">
              <hr />
              <p className="text-center text-lg font-semibold text-primary">
                ₱{selectedSize?.sizePrice ?? menuItem.basePrice}
              </p>

              {Array.isArray(menuItem.sizes) && menuItem.sizes.length > 0 && (
                <div className="mt-2 p-5">
                  <h4 className="text-left font-bold">Size Options:</h4>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {menuItem.sizes.map((size) => (
                      <Button
                        key={size._id}
                        variant="outline"
                        className={`flex flex-col items-center gap-1 border bg-white px-4 py-6 ${
                          selectedSize?._id === size._id
                            ? "bg-secondary text-white"
                            : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span className="text-sm text-gray-600">
                          {size.size}
                        </span>
                        <span className="font-semibold text-primary">
                          ₱{size.sizePrice}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                className="rounded-lg border px-3 py-1 hover:bg-gray-200"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="rounded-lg border px-3 py-1 hover:bg-gray-200"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              className="mx-auto mt-6 w-full md:max-w-sm lg:mx-0"
              onClick={handleAddToCart}
            >
              Add To Order
            </Button>
          </div>
        </div>
      </div>
      <Cart />
    </div>
  );
};

export default MenuItem;
