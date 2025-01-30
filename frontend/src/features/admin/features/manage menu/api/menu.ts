import axios from "axios";
import { MenuItem } from "../pages/ManageMenu";

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

export const getAllMenuItems = async () => {
  try {
    const response = await api.get("/api/menu/menu-items");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createMenuItem = async (menuItemData: MenuItem) => {
  try {
    // Make a POST request to create a menu item
    const response = await api.post("/api/menu/menu-items", menuItemData);

    return response.data; // return the response data (the created menu item)
  } catch (error) {
    // Check if the error is from axios
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
    // Handle unexpected errors
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
export const getAllSubcategories = async (categoryId: string) => {
  try {
    const response = await api.get(
      `/api/menu/categories/${categoryId}/subcategories`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
