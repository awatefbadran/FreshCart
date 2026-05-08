"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [router, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account</h1>
          <p className="text-gray-600 text-lg mb-8">
            Welcome back,{" "}
            <span className="font-semibold text-green-700">{user.name}</span>.
            Manage your profile, orders and saved items from here.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/profile"
              className="rounded-3xl border border-gray-200 bg-green-50 p-6 text-left hover:bg-green-100 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Profile
              </h2>
              <p className="text-sm text-gray-500">
                Update your personal details and settings.
              </p>
            </Link>
            <Link
              href="/orders"
              className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:bg-slate-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Orders
              </h2>
              <p className="text-sm text-gray-500">
                Review your past orders and order status.
              </p>
            </Link>
            <Link
              href="/wishlist"
              className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:bg-slate-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Wishlist
              </h2>
              <p className="text-sm text-gray-500">
                See the items you saved for later.
              </p>
            </Link>
            <Link
              href="/cart"
              className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:bg-slate-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-500">
                Review cart items and continue checkout.
              </p>
            </Link>
            <Link
              href="/shop"
              className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:bg-slate-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Shop</h2>
              <p className="text-sm text-gray-500">
                Browse fresh collections and latest deals.
              </p>
            </Link>
            <Link
              href="/categories"
              className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:bg-slate-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Categories
              </h2>
              <p className="text-sm text-gray-500">
                Explore by category and find what you need.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
