"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { getWishlist } from "@/components/services/apiCall";
import { useAuth } from "@/context/AuthContext";

interface WishlistItem {
  _id: string;
  title?: string;
  price?: number;
}

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  setWishlist: (ids: string[]) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlistData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setWishlistState([]);
        return;
      }

      try {
        const res = await getWishlist(token);
        if (res && res.status === "success" && Array.isArray(res.data)) {
          const ids: string[] = res.data.map((item: WishlistItem) => item._id);
          setWishlistState(ids);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlistData();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        setWishlist: setWishlistState,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
