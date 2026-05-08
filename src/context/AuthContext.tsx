"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserFromToken } from "@/lib/auth";
import Cookies from "js-cookie";

type User = ReturnType<typeof getUserFromToken>;

interface AuthContextType {
  user: User;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(getUserFromToken());

  const refreshUser = () => {
    setUser(getUserFromToken());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("token");
      const currentUser = getUserFromToken();

      if (token && !user) {
        setUser(currentUser);
      } else if (!token && user) {
        setUser(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
