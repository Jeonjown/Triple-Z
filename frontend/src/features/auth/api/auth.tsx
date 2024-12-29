import axios from "axios";

// Set the baseURL to your backend server's address
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
});

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post("/api/user/jwtSignup", {
      name,
      email,
      password,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
