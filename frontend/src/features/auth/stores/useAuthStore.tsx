import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  role: string;
}

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData: User) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

// Accessing the current state

// Log the state values that exist
const logState = () => {
  const state = useAuthStore.getState(); // Get the state directly from the store
  console.log("Current state:", state); // Log the entire state
};

logState();

export default useAuthStore;
