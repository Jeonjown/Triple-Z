import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
});

export const signupUser = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    const response = await api.post(
      "/api/user/jwtSignup",
      {
        username,
        email,
        password,
        confirmPassword,
      },
      { withCredentials: true },
    );
    console.log("user signed up successfully", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || "an error occured");
    }
  }
};
