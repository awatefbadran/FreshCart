"use client";

import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/components/services/apiCall";
import { useCart } from "@/context/CartContext";
import PageLoader from "@/components/ui/PageLoader";
import toast from "react-hot-toast";

interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    category: { name: string };
    ratingsAverage: number;
  };
}

interface CartData {
  status?: string;
  data: {
    products: CartItem[];
    totalCartPrice: number;
  };
  numOfCartItems: number;
  cartId: string;
}

export default function CartPage() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = Cookies.get("token");
  const router = useRouter();
  const { refreshCart } = useCart();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCartItems(token);
        if (response.status === "success") {
          setCartData(response as CartData);
        }
        console.log("Cart data:", response);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [token, router]);

  const handleUpdateQuantity = async (productId: string, count: number) => {
    if (!token || count < 1) return;
    toast.loading("Updating cart...");
    try {
      const response = await updateCartItem(productId, count, token);
      if (response?.data) {
        setCartData(response as CartData);
        refreshCart();
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
    toast.dismiss();
  };

  const handleRemoveItem = async (productId: string) => {
    if (!token) return;
    toast.loading("Removing item...");
    try {
      const response = await removeCartItem(productId, token);
      if (response?.data) {
        setCartData(response as CartData);
        refreshCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
    toast.dismiss();
  };

  const handleClearCart = async () => {
    if (!token) return;
    toast.loading("Clearing cart...");
    try {
      await clearCart(token);
      setCartData(null);
      refreshCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
    toast.dismiss();
  };

  const products = cartData?.data?.products || [];
  const totalCartPrice = cartData?.data?.totalCartPrice || 0;
  const numOfCartItems = cartData?.numOfCartItems || 0;

  const FREE_SHIPPING_THRESHOLD = 500;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalCartPrice;
  const progressPercentage = Math.min(
    (totalCartPrice / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );
  const isFreeShipping = totalCartPrice >= FREE_SHIPPING_THRESHOLD;

  if (isLoading) return <PageLoader />;

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-linear-to-r from-green-600 to-green-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 640 512"
                    fill="currentColor"
                  >
                    <path d="M24-16C10.7-16 0-5.3 0 8S10.7 32 24 32l45.3 0c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1L456 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-255.9 0c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3 303.6 0c30.8 0 57.2-21.9 62.9-52.2L568.9 69.9C572.6 50.2 557.5 32 537.4 32l-412.7 0-.4-2c-4.8-26.6-28-46-55.1-46L24-16zM208 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm224 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></path>
                  </svg>
                </span>
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">
                You have{" "}
                <span className="font-semibold text-green-600">
                  {numOfCartItems} items
                </span>{" "}
                in your cart
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <Link
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {products.map((item: CartItem) => (
                <div
                  key={item._id || item.product._id}
                  className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex gap-4 sm:gap-6">
                      <Link
                        href={`/product/${item.product._id}`}
                        className="relative shrink-0 group"
                      >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gray-50 p-2 border border-gray-100 overflow-hidden">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            width={128}
                            height={128}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <Link href={`/product/${item.product._id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-1">
                              {item.product.title}
                            </h3>
                          </Link>
                          <p className="text-green-600 font-bold mt-1 text-lg">
                            {item.price} EGP
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.count - 1,
                                )
                              }
                              disabled={item.count <= 1}
                              className="h-8 w-8 rounded-lg cursor-pointer bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                            >
                              -
                            </button>
                            <span className="px-4 py-1.5 font-medium text-gray-900 text-sm">
                              {item.count}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.count + 1,
                                )
                              }
                              className="h-8 w-8 rounded-lg cursor-pointer bg-green-600 shadow-sm shadow-green-600/30 flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center disabled:opacity-40 transition-all duration-200"
                          >
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 448 512"
                              fill="currentColor"
                            >
                              <path d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <Link
                  href={`/`}
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
                >
                  <span>←</span> Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="group flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 448 512"
                    fill="currentColor"
                  >
                    <path d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"></path>
                  </svg>
                  <span>Clear all items</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Order Summary
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {numOfCartItems} items in your cart
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {isFreeShipping ? (
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg
                          width={20}
                          height={16}
                          viewBox="0 0 576 512"
                          fill="currentColor"
                        >
                          <path d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">
                          Free Shipping!
                        </p>
                        <p className="text-sm text-green-600">
                          You qualify for free delivery
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          width={20}
                          height={16}
                          viewBox="0 0 576 512"
                          fill="currentColor"
                          className="text-orange-500"
                        >
                          <path d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Add {remainingForFreeShipping} EGP For Free Shipping
                        </span>
                      </div>
                      <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {totalCartPrice} EGP
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span
                        className={`font-medium ${isFreeShipping ? "text-green-600" : "text-gray-900"}`}
                      >
                        {isFreeShipping ? "Free" : "Standard Rates Apply"}
                      </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-900 font-semibold text-lg">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">
                            {totalCartPrice}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/checkout?cartId=${cartData?.cartId}`}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 active:scale-[0.98]"
                  >
                    Secure Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
