import React, { useState, useEffect } from "react";
import { Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingPage from "@/pages/LoadingPage";
import { useFetchItemsByCategories } from "@/features/Menu/hooks/useFetchItemsByCategories";
import { useFetchMenu } from "@/features/Menu/hooks/useFetchMenu";

// Interfaces for menu structure
interface Subcategory {
  _id: string;
  subcategory: string;
}

interface Category {
  _id: string;
  category: string;
  subcategories?: Subcategory[];
}

interface MenuData {
  categories: Category[];
}

export interface SizeOption {
  _id: string;
  size: string;
  sizePrice: number;
}

// Added optional subcategoryName for flagging add-ons.
export interface MenuItem {
  _id: string;
  title: string;
  image: string;
  basePrice: number | null;
  sizes: SizeOption[];
  requiresSizeSelection: boolean;
  description?: string;
  availability?: boolean;
  subcategoryName?: string;
}

export interface SelectedItem {
  key: string;
  _id: string;
  sizeId?: string;
}

interface EmbeddedMenuProps {
  onAddToCart?: (item: MenuItem, sizeId?: string) => void;
}

const EmbeddedMenu: React.FC<EmbeddedMenuProps> = ({ onAddToCart }) => {
  const { data: menuData, isPending: menuPending } = useFetchMenu() as {
    data?: MenuData;
    isPending: boolean;
  };

  const { toast } = useToast();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use the "Packages" category (case‑insensitive)
  const packagesCategory = menuData?.categories.find(
    (cat) => cat.category.toLowerCase() === "packages",
  );

  useEffect(() => {
    if (packagesCategory) {
      setSelectedCategoryId(packagesCategory._id);
      if (
        packagesCategory.subcategories &&
        packagesCategory.subcategories.length > 0
      ) {
        setSelectedSubcategoryId(packagesCategory.subcategories[0]._id);
      } else {
        setSelectedSubcategoryId(null);
      }
    }
  }, [packagesCategory]);

  const { data: items, isPending: itemsPending } = useFetchItemsByCategories(
    selectedCategoryId ?? "",
    selectedSubcategoryId ?? "",
  ) as { data?: MenuItem[]; isPending: boolean };

  const filteredItems = (items || []).filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSizeChange = (itemId: string, newSizeId: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: newSizeId }));
  };

  const handleAddClick = (item: MenuItem) => {
    if (item.availability === false) {
      toast({
        title: "Item Unavailable",
        description: `${item.title} is not available.`,
        variant: "destructive",
      });
      return;
    }
    let sizeId: string | undefined = undefined;
    let price: number | null = item.basePrice;

    if (item.requiresSizeSelection && item.sizes.length > 0) {
      sizeId = selectedSizes[item._id] || item.sizes[0]._id;
      if (!selectedSizes[item._id]) {
        setSelectedSizes((prev) => ({ ...prev, [item._id]: sizeId! }));
      }
      const selectedSize = item.sizes.find((s) => s._id === sizeId);
      if (selectedSize) {
        price = selectedSize.sizePrice;
      }
    }

    if (onAddToCart) {
      onAddToCart(item, sizeId);
    }

    toast({
      title: "Added to Cart",
      description: `${item.title} for ₱${price} was added to your cart.`,
      variant: "default",
    });
  };

  if (menuPending || itemsPending) return <LoadingPage />;
  if (!packagesCategory) return <></>;

  return (
    <div className="mt-5 flex min-h-screen w-full flex-col rounded-md md:flex-row md:border md:p-5">
      {/* Mobile Sidebar */}
      <div className="block md:hidden">
        <div className="fixed left-0 top-24 z-10 w-full bg-white p-3 shadow-md">
          <button
            type="button"
            className="w-full rounded-md bg-primary p-2 text-white"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? "Close Menu" : "Select Subcategory"}
          </button>
          {isMobileSidebarOpen && packagesCategory.subcategories && (
            <div className="mt-2 animate-fadeIn rounded-md border bg-white p-3 shadow-lg transition-opacity duration-300 ease-in-out">
              {packagesCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  onClick={() => {
                    setSelectedSubcategoryId(subcategory._id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="block p-1 hover:font-bold"
                >
                  {subcategory.subcategory}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden w-full md:block md:w-1/4 md:border-r">
        <h3 className="mb-2 text-xl font-bold">Packages</h3>
        {packagesCategory.subcategories && (
          <div className="ml-4 mt-1 space-y-1">
            {packagesCategory.subcategories.map((subcat) => (
              <button
                key={subcat._id}
                type="button"
                className={`w-full rounded-md px-2 py-1 text-left transition duration-200 ${
                  selectedSubcategoryId === subcat._id
                    ? "bg-gray-100 font-semibold text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedSubcategoryId(subcat._id)}
              >
                {subcat.subcategory}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Main Content */}
      <div className="flex w-full flex-col p-4 md:w-3/4">
        <h3 className="mb-2 text-xl font-bold">Menu Items</h3>
        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border py-2 pl-10 pr-10 focus:outline-none"
          />
          {searchQuery && (
            <span
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setSearchQuery("")}
            >
              <XCircle className="h-5 w-5 text-gray-400" />
            </span>
          )}
        </div>
        {filteredItems.length === 0 && (
          <p className="text-gray-500">No items available.</p>
        )}
        <div className="flex-1 overflow-hidden">
          <div
            className="grid grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {filteredItems.map((item: MenuItem) => (
              <div
                key={item._id}
                className={`flex min-h-[320px] flex-col gap-2 rounded-lg border bg-white p-4 transition duration-150 hover:shadow-lg ${
                  item.availability === false
                    ? "pointer-events-none cursor-not-allowed opacity-50 grayscale filter"
                    : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-30 w-full rounded object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </div>
                  {item.requiresSizeSelection && item.sizes.length > 0 && (
                    <select
                      value={selectedSizes[item._id] || item.sizes[0]._id}
                      onChange={(e) =>
                        handleSizeChange(item._id, e.target.value)
                      }
                      className="mt-1 w-full rounded border p-1 text-sm"
                    >
                      {item.sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.size} (₱{size.sizePrice})
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="mx-auto mt-auto">
                    <Button
                      type="button"
                      onClick={() => handleAddClick(item)}
                      disabled={item.availability === false}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedMenu;
