import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "An error occurred",
      };
    }
    // Handle unexpected errors
    throw {
      statusCode: 500,
      message: "An unexpected error occurred",
    };
  }
};

export const updateUserRole = async ({
  userId,
  roleToUpdate,
}: {
  userId: string;
  roleToUpdate: string;
}) => {
  try {
    const response = await api.patch(`api/users/${userId}`, {
      roleToUpdate,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error Updating user:", error);
    throw error;
  }
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  try {
    const response = await api.delete(`api/users/${userId}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error Updating user:", error);
    throw error;
  }
};

export const fetchUser = async (userId: string) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "An error occurred",
      };
    }
    // Handle unexpected errors
    throw {
      statusCode: 500,
      message: "An unexpected error occurred",
    };
  }
};
