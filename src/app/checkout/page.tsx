"use client";
import Image from "next/image";
import Link from "next/link";
import visa from "@/../public/visa.png";
import mastercard from "@/../public/mastercard.png";
import amex from "@/../public/amex.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  createCashOrder,
  createOnlineOrder,
  getCartItems,
} from "@/components/services/apiCall";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
  city: z.string().min(2, "City is required"),
  details: z.string().min(5, "Address details are required"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
});

type CheckoutSchema = z.infer<typeof checkoutSchema>;

interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
  };
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const router = useRouter();
  const { refreshCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [numOfCartItems, setNumOfCartItems] = useState(0);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      const res = await getCartItems(token);
      if (res.status === "success") {
        setCartItems(res.data.products);
        setTotalCartPrice(res.data.totalCartPrice);
        setNumOfCartItems(res.numOfCartItems);
      }
    };
    fetchCart();
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CheckoutSchema) => {
    if (!token) {
      toast.error("Please login first!");
      return;
    }
    if (!cartId) {
      toast.error("Cart ID not found!");
      return;
    }

    setIsSubmitting(true);

    const shippingAddress = {
      city: data.city,
      details: data.details,
      phone: data.phone,
    };

    try {
      if (paymentMethod === "cash") {
        const res = await createCashOrder(cartId, shippingAddress, token);
        if (res.status === "success") {
          toast.success("Order placed successfully!");
          refreshCart();
          router.push("/orders");
        } else {
          toast.error(res.message || "Failed to place order");
        }
      } else {
        const res = await createOnlineOrder(cartId, shippingAddress, token);
        if (res.status === "success" && res.session?.url) {
          window.location.href = res.session.url;
        } else {
          toast.error(res.message || "Failed to create payment session");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-linear-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="container">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/cart" className="hover:text-green-600 transition">
              Cart
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-linear-to-br from-green-600 to-green-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                  <svg
                    width={37.5}
                    height={30}
                    data-prefix="fas"
                    data-icon="receipt"
                    role="img"
                    viewBox="0 0 384 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.2-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6S384 14.6 384 24l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6l-40.4-34.6-40.4 34.6c-9 7.7-22.2 7.7-31.2 0l-40.4-34.6-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM104 136c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0zM80 352c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24-120c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z"
                    ></path>
                  </svg>
                </span>
                Complete Your Order
              </h1>
              <p className="text-gray-500 mt-2">
                Review your items and complete your purchase
              </p>
            </div>
            <Link
              href="/cart"
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      width={22.5}
                      height={18}
                      data-prefix="fas"
                      data-icon="house"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"
                      ></path>
                    </svg>{" "}
                    Shipping Address
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    Where should we deliver your order?
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <svg
                        width={17.5}
                        height={14}
                        data-prefix="fas"
                        data-icon="circle-info"
                        className="svg-inline--fa fa-circle-info text-blue-600 text-sm"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Delivery Information
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Please ensure your address is accurate for smooth
                        delivery
                      </p>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg
                          width={17.5}
                          height={14}
                          data-prefix="fas"
                          data-icon="city"
                          className="svg-inline--fa fa-city text-gray-500 text-sm"
                          role="img"
                          viewBox="0 0 576 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M320 0c-35.3 0-64 28.7-64 64l0 32-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-72C96 10.7 85.3 0 72 0S48 10.7 48 24l0 74c-27.6 7.1-48 32.2-48 62L0 448c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-64 0 0-128c0-35.3-28.7-64-64-64L320 0zm64 112l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zm-16 80c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zm16 112l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zm112-16c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zM256 304l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zM240 192c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zM128 304l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zM112 192c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        {...register("city")}
                        id="city"
                        type="text"
                        placeholder="e.g. Cairo, Alexandria, Giza"
                        className={`w-full px-4 py-3.5 border-2 rounded-xl pl-14 focus:outline-none transition-all ${
                          errors.city
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label
                      htmlFor="details"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg
                          width={17.5}
                          height={14}
                          data-prefix="fas"
                          data-icon="location-dot"
                          className="svg-inline--fa fa-location-dot text-gray-500 text-sm"
                          role="img"
                          viewBox="0 0 384 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                          ></path>
                        </svg>
                      </div>
                      <textarea
                        {...register("details")}
                        id="details"
                        rows={3}
                        placeholder="Street name, building number, floor, apartment..."
                        className={`w-full px-4 py-3.5 pl-14 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.details
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        }`}
                      />
                      {errors.details && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.details.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg
                          width={17.5}
                          height={14}
                          data-prefix="fas"
                          data-icon="phone"
                          className="svg-inline--fa fa-phone text-gray-500 text-sm"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        {...register("phone")}
                        id="phone"
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        className={`w-full px-4 py-3.5 pl-14 border-2 rounded-xl focus:outline-none transition-all    ${
                          errors.phone
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      width={22.5}
                      height={18}
                      data-prefix="fas"
                      data-icon="wallet"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64L72 128c-13.3 0-24-10.7-24-24S58.7 80 72 80l384 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L64 32zM416 256a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                      ></path>
                    </svg>{" "}
                    Payment Method
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    Choose how you&apos;d like to pay
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`w-full cursor-pointer p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === "cash"
                        ? "border-green-500 bg-linear-to-r from-green-50 to-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        paymentMethod === "cash"
                          ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <svg
                        width={25}
                        height={20}
                        data-prefix="fas"
                        data-icon="money-bill"
                        className="svg-inline--fa fa-money-bill text-xl"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm192 24c0 4.4-3.6 8.1-8 7.5-29-3.6-51.9-26.6-55.5-55.5-.5-4.4 3.1-8 7.5-8l48 0c4.4 0 8 3.6 8 8l0 48zM64 328c0-4.4 3.6-8.1 8-7.5 29 3.6 51.9 26.6 55.5 55.5 .5 4.4-3.1 8-7.5 8l-48 0c-4.4 0-8-3.6-8-8l0-48zm8-136.5c-4.4 .5-8-3.1-8-7.5l0-48c0-4.4 3.6-8 8-8l48 0c4.4 0 8.1 3.6 7.5 8-3.6 29-26.6 51.9-55.5 55.5zm368 129c4.4-.5 8 3.1 8 7.5l0 48c0 4.4-3.6 8-8 8l-48 0c-4.4 0-8.1-3.6-7.5-8 3.6-29 26.6-51.9 55.5-55.5z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${paymentMethod === "cash" ? "text-green-700" : "text-gray-900"}`}
                      >
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        paymentMethod === "cash"
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {paymentMethod === "cash" && "✓"}
                    </div>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full cursor-pointer p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === "card"
                        ? "border-green-500 bg-linear-to-r from-green-50 to-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        paymentMethod === "card"
                          ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <svg
                        width={25}
                        height={20}
                        data-prefix="fas"
                        data-icon="credit-card"
                        className="svg-inline--fa fa-credit-card text-xl"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${paymentMethod === "card" ? "text-green-700" : "text-gray-900"}`}
                      >
                        Pay Online
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Secure payment with Credit/Debit Card via Stripe
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Image src={visa} alt="visa" width={30} height={20} />
                        <Image
                          src={mastercard}
                          alt="mastercard"
                          width={30}
                          height={20}
                        />
                        <Image src={amex} alt="amex" width={30} height={20} />
                      </div>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        paymentMethod === "card"
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {paymentMethod === "card" && "✓"}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm sticky top-4">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      width={22.8}
                      height={18}
                      data-prefix="fas"
                      data-icon="bag-shopping"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M160 80c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 384c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48c0-61.9-50.1-112-112-112S112 18.1 112 80l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                      ></path>
                    </svg>{" "}
                    Order Summary
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {numOfCartItems} items
                  </p>
                </div>
                <div className="p-5">
                  <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                      >
                        <div className="w-14 h-14 rounded-lg bg-white p-1 border border-gray-100 shrink-0">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            width={46}
                            height={46}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.count} × {item.price} EGP
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">
                          {item.count * item.price}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-100 my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">{totalCartPrice} EGP</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {totalCartPrice}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">EGP</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting || !cartId}
                    className="w-full cursor-pointer mt-6 bg-linear-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : paymentMethod === "cash" ? (
                      <>
                        <svg
                          width={20}
                          height={16}
                          data-prefix="fas"
                          data-icon="box"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                          ></path>
                        </svg>{" "}
                        Place Order
                      </>
                    ) : (
                      <>
                        <svg
                          width={20}
                          height={16}
                          data-prefix="fas"
                          data-icon="shield-halved"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                          ></path>
                        </svg>
                        Proceed to Payment
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg 
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="shield-halved"
                        className="svg-inline--fa fa-shield-halved text-green-500"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                        ></path>
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg 
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="truck"
                        className="svg-inline--fa fa-truck text-blue-500"
                        role="img"
                        viewBox="0 0 576 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                        ></path>
                      </svg>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg 
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="box"
                        className="svg-inline--fa fa-box text-orange-500"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                        ></path>
                      </svg>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-green-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
