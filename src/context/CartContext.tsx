"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { getCart } from "@/components/services/apiCall";
import { useAuth } from "@/context/AuthContext";

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const res = await getCart(token);
        if (res && res.status === "success") {
          setCartCount(res.numOfCartItems || 0);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  const refreshCart = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await getCart(token);
      if (res && res.status === "success") {
        setCartCount(res.numOfCartItems || 0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
