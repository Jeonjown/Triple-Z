import { create } from "zustand";

interface UserAuth {
  _id: string;
  username: string;
  role: string;
}

type AuthState = {
  isAuthenticated: boolean;
  user: UserAuth | null;
  login: (userData: UserAuth) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData: UserAuth) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
