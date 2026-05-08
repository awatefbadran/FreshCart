"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Eye, Loader2, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  getProducts,
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "@/components/services/apiCall";
import { Product } from "@/types/index";
import SectionHeader from "@/components/home/SectionHeader";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ProductSuggest({
  categoryId,
  currentProductId,
}: {
  categoryId: string;
  currentProductId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCartItems, setLoadingCartItems] = useState<
    Record<string, boolean>
  >({});
  const [successCartItems, setSuccessCartItems] = useState<
    Record<string, boolean>
  >({});
  const [loadingWishlistItems, setLoadingWishlistItems] = useState<
    Record<string, boolean>
  >({});
  const swiperRef = useRef<SwiperType | null>(null);
  const { data: session } = useSession();
  const { wishlist, setWishlist } = useWishlist();
  const { refreshCart } = useCart();

  useEffect(() => {
    getProducts(20).then((data) => {
      const filtered = data.filter(
        (p: Product) =>
          p.category._id === categoryId && p._id !== currentProductId,
      );
      setProducts(filtered);
    });
  }, [categoryId, currentProductId]);

  const handleAddToCart = async (productId: string) => {
    const token =
      Cookies.get("token") || session?.user?.token || session?.accessToken;
    if (!token) {
      toast.error("Please login first!");
      return;
    }
    if (session?.user && !Cookies.get("token")) {
      toast.error(
        "Social login doesn't support Cart operations. Please use Email/Password.",
      );
      return;
    }
    setLoadingCartItems((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await addToCart(productId, token);
      if (res.status === "success") {
        toast.success(res.message || "Added to cart!");
        refreshCart();
        setSuccessCartItems((prev) => ({ ...prev, [productId]: true }));
        setTimeout(
          () =>
            setSuccessCartItems((prev) => ({ ...prev, [productId]: false })),
          2000,
        );
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoadingCartItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const toggleWishlist = async (productId: string) => {
    const token =
      Cookies.get("token") || session?.user?.token || session?.accessToken;
    if (!token) {
      toast.error("Please login first!");
      return;
    }
    if (session?.user && !Cookies.get("token")) {
      toast.error(
        "Social login doesn't support Wishlist operations. Please use Email/Password.",
      );
      return;
    }
    const isInWishlist = wishlist.includes(productId);
    setWishlist(
      isInWishlist
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId],
    );
    setLoadingWishlistItems((prev) => ({ ...prev, [productId]: true }));
    try {
      const data = isInWishlist
        ? await removeFromWishlist(productId, token)
        : await addToWishlist(productId, token);
      if (data?.status === "success") {
        setWishlist(data.data);
        toast.success(data.message || "Wishlist updated!");
      } else {
        setWishlist(wishlist);
        toast.error(data?.message || "Something went wrong");
      }
    } catch {
      setWishlist(wishlist);
      toast.error("Failed to update wishlist.");
    } finally {
      setLoadingWishlistItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="You May Also" highlight="Like" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition cursor-pointer"
          >
            <svg width="8" height="12" viewBox="0 0 8 14" fill="none">
              <path
                d="M7 1L1 7L7 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition cursor-pointer"
          >
            <svg width="8" height="12" viewBox="0 0 8 14" fill="none">
              <path
                d="M1 1L7 7L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.map((product) => {
          const isFavorited = wishlist.includes(product._id);
          const isItemLoading = loadingCartItems[product._id];
          const isItemSuccess = successCartItems[product._id];

          return (
            <SwiperSlide key={product._id}>
              <div className="border border-gray-200 rounded-xl p-3 hover:shadow-md hover:-translate-y-1 duration-200 transition">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <Link href={`/products/${product._id}`}>
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-48 object-contain cursor-pointer"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      disabled={loadingWishlistItems[product._id]}
                      className="bg-white h-8 w-8 rounded-full flex items-center justify-center cursor-pointer text-gray-600 group shadow-sm"
                    >
                      <Heart
                        size={16}
                        fill={isFavorited ? "currentColor" : "none"}
                        className={`transition-colors duration-200 group-hover:text-red-500 ${
                          loadingWishlistItems[product._id]
                            ? "text-red-300 animate-pulse"
                            : isFavorited
                              ? "text-red-500"
                              : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button className="bg-white h-8 w-8 cursor-pointer rounded-full flex items-center justify-center text-gray-600 hover:text-green-600 shadow-sm">
                      <svg
                        width={20}
                        height={16}
                        data-prefix="fas"
                        data-icon="arrows-rotate"
                        className="svg-inline--fa fa-arrows-rotate"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"
                        ></path>
                      </svg>
                    </button>
                    <Link href={`/products/${product._id}`}>
                      <button className="bg-white h-8 w-8 rounded-full flex items-center justify-center cursor-pointer text-gray-600 group shadow-sm">
                        <Eye size={16} className="text-gray-600 group-hover:text-green-600" />
                      </button>
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-1">
                  {product.category.name}
                </p>

                <Link href={`/products/${product._id}`}>
                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1 hover:text-green-600 transition cursor-pointer">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.round(product.ratingsAverage)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-400">
                    ({product.ratingsQuantity})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-bold text-sm">
                    {product.price} EGP
                  </p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={isItemLoading || isItemSuccess}
                    className={`w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center text-xl font-light ${
                      isItemSuccess
                        ? "bg-green-700 text-white scale-110"
                        : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    } ${isItemLoading ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {isItemLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isItemSuccess ? (
                      <Check size={18} />
                    ) : (
                      "+"
                    )}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
