import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Menu
export const getAllMenu = async () => {
  try {
    const response = await api.get("/api/menu");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

// MenuItems
interface Size {
  size: string;
  sizePrice: number;
}

interface Item {
  _id?: string;
  title: string;
  basePrice: number | null;
  sizes: Size[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
}

export interface MenuItemData {
  _id?: string;
  category: string;
  subcategory: string;
  item: Item;
  image: File | string | null;
}

// MENU ITEMS
export const getAllMenuItems = async () => {
  try {
    const response = await api.get("/api/menu/menu-items");
    return response.data; // If no items, this will be an empty array
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
export const createMenuItem = async (menuItemData: MenuItemData) => {
  try {
    const formData = new FormData();

    // Append category and subcategory
    formData.append("category", menuItemData.category);
    formData.append("subcategory", menuItemData.subcategory);

    // Append item fields
    formData.append("item[title]", menuItemData.item.title);
    formData.append(
      "item[basePrice]",
      menuItemData.item.basePrice?.toString() || "",
    );

    formData.append(
      "item[requiresSizeSelection]",
      menuItemData.item.requiresSizeSelection.toString(),
    );
    formData.append("item[description]", menuItemData.item.description);

    // Handle sizes conditionally
    if (menuItemData.item.requiresSizeSelection) {
      menuItemData.item.sizes.forEach((size, index) => {
        formData.append(`item[sizes][${index}][size]`, size.size);
        formData.append(
          `item[sizes][${index}][sizePrice]`,
          size.sizePrice.toString(),
        );
      });
    }

    // Attach the image file
    if (menuItemData.image instanceof File) {
      formData.append("image", menuItemData.image);
    } else {
      throw new Error("Image must be a valid file.");
    }

    // Make the API request
    const response = await api.post("/api/menu/menu-items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const editMenuItem = async (menuItemData: MenuItemData) => {
  try {
    const formData = new FormData();

    // Append category and subcategory to the form
    formData.append("category", menuItemData.category);
    formData.append("subcategory", menuItemData.subcategory);

    // Append item fields like title, basePrice, and description
    formData.append("title", menuItemData.item.title);
    formData.append("basePrice", menuItemData.item.basePrice?.toString() || "");
    formData.append(
      "requiresSizeSelection",
      menuItemData.item.requiresSizeSelection.toString(),
    );
    formData.append("description", menuItemData.item.description || "");

    // Handle availability properly: Ensure it is a boolean, not a string
    if (menuItemData.item.availability !== undefined) {
      formData.append(
        "availability",
        menuItemData.item.availability.toString(),
      );
    }

    // Handle sizes logic based on requiresSizeSelection
    if (menuItemData.item.requiresSizeSelection) {
      // Ensure sizes are passed as an array, not a string
      const sizes = Array.isArray(menuItemData.item.sizes)
        ? menuItemData.item.sizes
        : [];
      sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][size]`, size.size);
        formData.append(
          `sizes[${index}][sizePrice]`,
          size.sizePrice.toString(),
        );
      });
    } else {
      // If no size selection is required, omit sizes or pass null
      formData.append("sizes", "null"); // Or you can omit this line entirely
    }

    // Handle image field (if it's a file or URL)
    if (menuItemData.image instanceof File) {
      formData.append("image", menuItemData.image);
    } else if (menuItemData.image) {
      formData.append("image", menuItemData.image);
    }

    if (!menuItemData._id) {
      throw new Error("Menu item _id is required for updating.");
    }

    // Make the PUT request to update the menu item
    const response = await api.put(
      `/api/menu/menu-items/${menuItemData._id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error updating menu item:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "An error occurred while updating the item.",
      );
    }
    throw new Error("An unexpected error occurred while updating the item.");
  }
};

export const deleteMenuItem = async (menuItemId: string) => {
  try {
    api.delete(`/api/menu/menu-items/${menuItemId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

// CATEGORIES
export interface Category {
  category: string;
  subcategories: string[];
}

export const createCategory = async (category: Category) => {
  console.log(category);
  try {
    const response = await api.post("/api/menu/categories", category);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const getAllCategories = async () => {
  try {
    const response = await api.get("/api/menu/categories");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const editCategory = async (categoryId: string, category: string) => {
  try {
    const response = await api.put(`api/menu/categories/${categoryId}`, {
      category,
    }); // Send category data
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await api.delete(`api/menu/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

// SUBCATEGORIES
export const getAllSubcategories = async (categoryId: string | null) => {
  console.log("from subcategories api:", categoryId);

  try {
    const response = await api.get(
      `/api/menu/categories/${categoryId}/subcategories`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "an error occurred subcategory",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const editSubcategory = async (
  categoryId: string,
  subcategoryId: string,
  subcategory: string,
) => {
  try {
    const response = await api.put(
      `/api/menu/categories/${categoryId}/subcategories/${subcategoryId}`,
      { subcategoryName: subcategory },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createSubcategory = async (
  categoryId: string,
  subcategory: string,
) => {
  try {
    const response = await api.post(
      `/api/menu/categories/${categoryId}/subcategories/`,
      { subcategoryName: subcategory },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteSubcategory = async (
  categoryId: string,
  subcategoryId: string,
) => {
  try {
    const response = await api.delete(
      `/api/menu/categories/${categoryId}/subcategories/${subcategoryId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
