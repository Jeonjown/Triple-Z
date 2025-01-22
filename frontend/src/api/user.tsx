import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const updateUserRole = async ({
  userId,
  roleToUpdate,
}: {
  userId: string;
  roleToUpdate: string;
}) => {
  try {
    const response = await api.patch(`api/user/${userId}`, {
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
    const response = await api.delete(`api/user/${userId}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error Updating user:", error);
    throw error;
  }
};
