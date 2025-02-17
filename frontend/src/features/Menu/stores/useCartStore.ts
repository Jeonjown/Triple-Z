import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem,
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((cartItem) =>
            cartItem.id === id
              ? { ...cartItem, quantity: Math.max(1, quantity) }
              : cartItem,
          ),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((cartItem) => cartItem.id !== id),
        })),
    }),
    {
      name: "cart-storage", // Key for localStorage
    },
  ),
);
