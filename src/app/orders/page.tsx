"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/components/services/apiCall";
import { getToken } from "@/lib/auth";

interface Order {
  _id: string;
  createdAt: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isDelivered: boolean;
  isPaid: boolean;
  cartItems: {
    product: {
      _id: string;
      title: string;
      imageCover: string;
    };
    price: number;
    count: number;
  }[];
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const data = await getUserOrders(user.id, token);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-white p-12 shadow-xl border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="container py-8">
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link className="hover:text-green-600 transition" href="/">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">My Orders</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <span className="text-2xl text-white">📦</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Track and manage your {orders.length} orders
                  </p>
                </div>
              </div>
              <Link
                className="self-start sm:self-auto text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-50 transition-all text-sm"
                href={`/`}
              >
                🛒 Continue Shopping
              </Link>
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No orders found
              </h2>
              <p className="text-gray-500 mb-6">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border transition-all duration-300 overflow-hidden border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex gap-5">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 border border-gray-100 p-2.5 overflow-hidden">
                          {order.cartItems.length > 0 && (
                            <Image
                              src={order.cartItems[0].product.imageCover}
                              alt={order.cartItems[0].product.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="object-contain"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-lg mb-2">
                              <span className="text-xs text-amber-600">⏱️</span>
                              <span className="text-xs font-semibold text-amber-600">
                                {order.isDelivered ? "Delivered" : "Processing"}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                              <span className="text-xs text-gray-400">#</span>
                              {order._id.slice(-6)}
                            </h3>
                          </div>
                          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
                            <span className="text-gray-600">💰</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400"></span>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1.5">
                            {order.cartItems.length} items
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1.5">
                            {order.shippingAddress.city}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {order.totalOrderPrice}
                            </span>
                            <span className="text-sm font-medium text-gray-400 ml-1">
                              EGP
                            </span>
                          </div>
                          <Link
                            href={`/products/${order.cartItems[0]?.product._id}`}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
