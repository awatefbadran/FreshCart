"use client";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export function useCurrentUser() {
  const { data: session } = useSession();
  const { user: tokenUser } = useAuth();

  if (session?.user) {
    return {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  if (tokenUser) {
    return {
      name: tokenUser.name,
      email: tokenUser.email,
      image: null,
    };
  }

  return null;
}