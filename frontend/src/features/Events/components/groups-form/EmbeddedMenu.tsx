import React, { useState, useEffect, useMemo } from "react";
import { useFetchMenu } from "@/features/Menu/hooks/useFetchMenu";
import { useFetchItemsByCategories } from "@/features/Menu/hooks/useFetchItemsByCategories";
import LoadingPage from "@/pages/LoadingPage";
import { Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

export interface MenuItem {
  _id: string;
  title: string;
  image: string;
  basePrice: number | null;
  sizes: SizeOption[];
  requiresSizeSelection: boolean;
  description?: string;
  availability?: boolean; // Optional availability flag
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
  // Fetch menu data and pending state
  const { data: menuData, isPending: menuPending } = useFetchMenu() as {
    data?: MenuData;
    isPending: boolean;
  };

  // Initialize the toast function
  const { toast } = useToast();

  // State for category, subcategory and other UI controls
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

  // Memoize filtered categories to avoid recalculation on every render.
  const filteredCategories = useMemo(() => {
    return (
      menuData?.categories.filter(
        (category) => category.category.toLowerCase() !== "packages",
      ) || []
    );
  }, [menuData]);

  // Set default category and subcategory when menu loads
  useEffect(() => {
    if (filteredCategories.length) {
      const defaultCategory = filteredCategories[0];
      setSelectedCategoryId(defaultCategory._id);
      if (
        defaultCategory.subcategories &&
        defaultCategory.subcategories.length
      ) {
        setSelectedSubcategoryId(defaultCategory.subcategories[0]._id);
      } else {
        setSelectedSubcategoryId(null);
      }
    }
  }, [filteredCategories]);

  // Fetch items based on selected category/subcategory
  const { data: items, isPending: itemsPending } = useFetchItemsByCategories(
    selectedCategoryId ?? "",
    selectedSubcategoryId ?? "",
  ) as { data?: MenuItem[]; isPending: boolean };

  // Filter items using the search query
  const filteredItems = (items || []).filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Update the selected size for an item
  const handleSizeChange = (itemId: string, newSizeId: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: newSizeId }));
  };

  // Handle Add to Cart click
  const handleAddClick = (item: MenuItem) => {
    // If the item is unavailable, show a toast and do nothing
    if (item.availability === false) {
      toast({
        title: "Item Unavailable",
        description: `${item.title} is not available.`,
        variant: "destructive",
      });
      return;
    }
    let sizeId: string | undefined = undefined;
    let price: number | null = item.basePrice; // Default to basePrice

    // If item requires size selection, determine the selected size and its price
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

    // Trigger the callback if provided
    if (onAddToCart) {
      onAddToCart(item, sizeId);
    }

    // Display the toast with the item title and price
    toast({
      title: "Added to Cart",
      description: `${item.title} for ₱${price} was added to your cart.`,
      variant: "default",
    });
  };

  // Render a loading state if data is still fetching
  if (menuPending || itemsPending) return <LoadingPage />;
  if (!filteredCategories.length) return <></>;

  return (
    <div className="mt-5 flex w-full flex-col rounded-md md:flex-row md:border md:p-5">
      {/* Mobile Sidebar Dropdown */}
      <div className="block md:hidden">
        <div className="fixed left-0 top-24 z-10 w-full bg-white p-3 shadow-md">
          <button
            className="w-full rounded-md bg-primary p-2 text-white"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? "Close Menu" : "Select Category"}
          </button>
          {isMobileSidebarOpen && (
            <div className="mt-2 animate-fadeIn rounded-md border bg-white p-3 shadow-lg transition-opacity duration-300 ease-in-out">
              {filteredCategories.map((category) => (
                <div key={category._id} className="mb-3">
                  <h2 className="font-bold text-primary">
                    {category.category}
                  </h2>
                  {category.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory._id}
                      onClick={() => {
                        setSelectedCategoryId(category._id);
                        setSelectedSubcategoryId(subcategory._id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="block p-1 hover:font-bold"
                    >
                      {subcategory.subcategory}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden w-full md:block md:w-1/4 md:border-r">
        <h3 className="mb-2 text-xl font-bold">Categories</h3>
        {filteredCategories.map((category) => (
          <div key={category._id} className="mb-2">
            <button
              type="button"
              className={`w-full rounded-md px-3 py-2 text-left transition duration-200 ${
                selectedCategoryId === category._id
                  ? "bg-gray-100 font-bold text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedCategoryId(category._id);
                if (
                  category.subcategories &&
                  category.subcategories.length > 0
                ) {
                  setSelectedSubcategoryId(category.subcategories[0]._id);
                } else {
                  setSelectedSubcategoryId(null);
                }
              }}
            >
              {category.category}
            </button>
            {selectedCategoryId === category._id && category.subcategories && (
              <div className="ml-4 mt-1 space-y-1">
                {category.subcategories.map((subcat) => (
                  <button
                    key={subcat._id}
                    type="button"
                    className={`w-full rounded-md px-2 py-1 text-left transition duration-200 ${
                      selectedSubcategoryId === subcat._id
                        ? "bg-gray-100 font-semibold text-secondary"
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
        ))}
      </div>
      {/* Menu Items */}
      <div className="w-full p-4 md:w-3/4">
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
                    onChange={(e) => handleSizeChange(item._id, e.target.value)}
                    className="mt-1 w-full rounded border p-1 text-sm"
                  >
                    {item.sizes.map((size) => (
                      <option key={size._id} value={size._id}>
                        {size.size} (₱{size.sizePrice})
                      </option>
                    ))}
                  </select>
                )}
                <p className="mb-4 mt-1 whitespace-normal text-sm text-gray-600">
                  {item.description}
                </p>
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
  );
};

export default EmbeddedMenu;
