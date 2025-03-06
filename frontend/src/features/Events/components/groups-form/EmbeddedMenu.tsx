import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useFetchMenu } from "@/features/Menu/hooks/useFetchMenu";
import { useFetchItemsByCategories } from "@/features/Menu/hooks/useFetchItemsByCategories";
import LoadingPage from "@/pages/LoadingPage";
import { Search, XCircle } from "lucide-react";

// Data interfaces
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
}

// Type for selected menu item (includes optional size selection)
export interface SelectedItem {
  id: string;
  sizeId?: string;
}

// Props for EmbeddedMenu
interface EmbeddedMenuProps {
  onSelectionChange?: (selectedItems: SelectedItem[]) => void;
}

const EmbeddedMenu: React.FC<EmbeddedMenuProps> = ({ onSelectionChange }) => {
  const { setValue } = useFormContext();

  // Fetch menu data
  const { data: menuData, isPending: menuPending } = useFetchMenu() as {
    data?: MenuData;
    isPending: boolean;
  };

  // Local state for category and subcategory selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  // Selected items (with optional size id)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  // For items requiring size selection, store chosen size per item
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (menuData?.categories?.length) {
      const defaultCategory = menuData.categories[0];
      setSelectedCategoryId(defaultCategory._id);
      if (defaultCategory.subcategories?.length) {
        setSelectedSubcategoryId(defaultCategory.subcategories[0]._id);
      } else {
        setSelectedSubcategoryId(null);
      }
    }
  }, [menuData]);

  const { data: items, isPending: itemsPending } = useFetchItemsByCategories(
    selectedCategoryId ?? "",
    selectedSubcategoryId ?? "",
  ) as { data?: MenuItem[]; isPending: boolean };

  // Filter items by search query (case insensitive)
  const filteredItems = (items || []).filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Toggle selection by clicking on the item card.
  const handleSelectItem = (item: MenuItem) => {
    const exists = selectedItems.find((s) => s.id === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter((s) => s.id !== item._id));
    } else {
      let sizeId: string | undefined;
      if (item.requiresSizeSelection && item.sizes.length > 0) {
        sizeId = selectedSizes[item._id] || item.sizes[0]._id;
        if (!selectedSizes[item._id]) {
          setSelectedSizes((prev) => ({ ...prev, [item._id]: sizeId! }));
        }
      }
      setSelectedItems([...selectedItems, { id: item._id, sizeId }]);
    }
  };

  // Handle size change for an item.
  const handleSizeChange = (itemId: string, newSizeId: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: newSizeId }));
    setSelectedItems((prev) =>
      prev.map((s) => (s.id === itemId ? { ...s, sizeId: newSizeId } : s)),
    );
  };

  useEffect(() => {
    setValue("menuSelection", selectedItems);
    if (onSelectionChange) onSelectionChange(selectedItems);
  }, [selectedItems, setValue, onSelectionChange]);

  if (menuPending || itemsPending) return <LoadingPage />;
  if (!menuData?.categories) return <></>;

  return (
    <div className="mt-5 flex flex-col rounded-md md:flex-row md:border md:p-5">
      {/* Sidebar */}
      <div className="w-full p-4 md:w-1/4 md:border-r">
        <h3 className="mb-2 text-xl font-bold">Categories</h3>
        {menuData.categories.map((category: Category) => (
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
                {category.subcategories.map((subcat: Subcategory) => (
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
        {(filteredItems || []).length === 0 && (
          <p className="text-gray-500">No items available.</p>
        )}
        <div
          className="grid grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {(filteredItems || []).map((item: MenuItem) => {
            const isSelected = selectedItems.some((s) => s.id === item._id);
            return (
              <div
                key={item._id}
                className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition duration-150 hover:shadow-lg ${
                  isSelected ? "border-primary bg-muted" : "bg-white"
                }`}
                onClick={() => handleSelectItem(item)}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.size} (₱{size.sizePrice})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="mt-1 whitespace-normal text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmbeddedMenu;
