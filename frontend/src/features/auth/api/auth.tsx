import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface loginData {
  email: string;
  password: string;
}

export const signupUser = async ({
  username,
  email,
  password,
  confirmPassword,
}: SignupData) => {
  try {
    const response = await api.post("/api/auth/jwt-signup", {
      username,
      email,
      password,
      confirmPassword,
    });

    console.log("from api: ", response.data.user);

    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const loginUser = async ({ email, password }: loginData) => {
  try {
    const response = await api.post("/api/auth/jwt-login", {
      email,
      password,
    });
    console.log(response.data.user);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/api/auth/check-auth");
    console.log("from: api", response.data.user);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "an error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const logout = async () => {
  try {
    console.log("logout clicked");
    const response = await api.post("/api/auth/logout");
    if (response?.data && response.data.message) {
      return response.data.message;
    } else if (!response?.data) {
      throw new Error("Logout failed: Empty response from server");
    } else {
      throw new Error("Logout failed: No message received");
    }
  } catch (error) {
    // Handle axios-specific errors
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
    // Handle unexpected errors
    throw new Error("An unexpected error occurred during logout");
  }
};
