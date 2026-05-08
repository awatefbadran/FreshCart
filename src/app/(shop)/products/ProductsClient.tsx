"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, Heart, RefreshCw, Eye, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import PageLoader from "@/components/ui/PageLoader";

import { Product } from "@/types";
import {
  getProducts,
  addToWishlist,
  removeFromWishlist,
  addToCart,
} from "@/components/services/apiCall";

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
  };
  accessToken?: string;
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryName, setCategoryName] = useState<string>("All Products");

  const [loadingCartItems, setLoadingCartItems] = useState<
    Record<string, boolean>
  >({});
  const [successCartItems, setSuccessCartItems] = useState<
    Record<string, boolean>
  >({});
  const [loadingWishlistItems, setLoadingWishlistItems] = useState<
    Record<string, boolean>
  >({});

  const { data: session } = useSession() as { data: CustomSession | null };

  const { wishlist, setWishlist } = useWishlist();
  const { refreshCart } = useCart();

  useEffect(() => {
    setLoading(true);

    getProducts(50)
      .then((data: Product[]) => {
        if (categoryId) {
          const filteredProducts = data.filter(
            (p: Product) => p.category._id === categoryId,
          );
          setProducts(filteredProducts);

          if (filteredProducts.length > 0) {
            setCategoryName(filteredProducts[0].category.name);
          } else {
            setCategoryName("Category Not Found");
          }
        } else {
          setProducts(data);
          setCategoryName("All Products");
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const toggleWishlist = async (productId: string) => {
    const token =
      Cookies.get("token") || session?.user?.token || session?.accessToken;

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    if (session?.user && !Cookies.get("token")) {
      toast.error(
        "Social login doesn't support Wishlist operations on this API. Please use Email/Password.",
      );
      return;
    }

    const isInWishlist = wishlist.includes(productId);

    setWishlist(
      isInWishlist
        ? wishlist.filter((id: string) => id !== productId)
        : [...wishlist, productId],
    );

    setLoadingWishlistItems((prev) => ({ ...prev, [productId]: true }));

    try {
      let data;
      if (isInWishlist) {
        data = await removeFromWishlist(productId, token);
      } else {
        data = await addToWishlist(productId, token);
      }

      if (data && data.status === "success") {
        setWishlist(data.data);
        toast.success(data.message || "Wishlist updated!");
      } else {
        setWishlist(wishlist);
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error: unknown) {
      setWishlist(wishlist);
      toast.error("Failed to update wishlist.");
      console.error("Failed to update wishlist:", error);
    } finally {
      setLoadingWishlistItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (productId: string) => {
    const token =
      Cookies.get("token") || session?.user?.token || session?.accessToken;

    if (!token) {
      toast.error("Please login first to add items to cart!");
      return;
    }

    if (session?.user && !Cookies.get("token")) {
      toast.error(
        "Social login doesn't support Cart operations on this API. Please use Email/Password.",
      );
      return;
    }

    setLoadingCartItems((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await addToCart(productId, token);

      if (res.status === "success") {
        toast.success(res.message || "Product added to cart!");
        refreshCart();

        setSuccessCartItems((prev) => ({ ...prev, [productId]: true }));

        setTimeout(() => {
          setSuccessCartItems((prev) => ({ ...prev, [productId]: false }));
        }, 2000);
      } else {
        toast.error(res.message || "Failed to add product");
      }
    } catch (error: unknown) {
      console.error("Cart Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoadingCartItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="container py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link className="hover:text-white transition-colors" href="/">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link
              className="hover:text-white transition-colors"
              href="/categories"
            >
              Categories
            </Link>

            {categoryId && (
              <>
                <span className="text-white/40">/</span>
                <Link
                  className="hover:text-white transition-colors"
                  href={`/products?category=${categoryId}`}
                >
                  {categoryName}
                </Link>
                <span className="text-white/40">/</span>
                <span className="text-white font-medium">{categoryName}</span>
              </>
            )}
          </nav>
          <div className="flex items-center gap-5">
            <Link
              href="/categories"
              className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-2 ring-white/50 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {products.length > 0 ? (
                <>
                  <Image
                    src={products[0].category.image}
                    alt={products[0].category.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              )}
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight capitalize">
                {categoryName}
              </h1>
              <p className="text-white/80 mt-1">
                Browse products in {categoryName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {categoryId && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                width={17.5}
                height={14}
                className="fill-current"
                viewBox="0 0 512 512"
              >
                <path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z" />
              </svg>
              Active Filters:
            </span>
            <Link
              href={`/categories`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium"
            >
              <svg
                width={15}
                height={12}
                className="fill-current text-xs"
                viewBox="0 0 512 512"
              >
                <path d="M232.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 149.8C5.4 145.8 0 137.3 0 128s5.4-17.9 13.9-21.8L232.5 5.2zM48.1 218.4l164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 277.8C5.4 273.8 0 265.3 0 256s5.4-17.9 13.9-21.8l34.1-15.8zM13.9 362.2l34.1-15.8 164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 405.8C5.4 401.8 0 393.3 0 384s5.4-17.9 13.9-21.8z" />
              </svg>
              {categoryName}
              <Link
                href={`/categories/${categoryId}`}
                className="text-green-500 hover:text-red-600 transition-colors"
              >
                <svg
                  width={15}
                  height={12}
                  className="fill-current text-xs"
                  viewBox="0 0 384 512"
                >
                  <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" />
                </svg>
              </Link>
            </Link>
            <Link
              className="text-sm text-gray-500 hover:text-gray-700 underline"
              href="/products"
            >
              Clear all
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">
              No products found for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product: Product) => {
              const hasDiscount =
                product.priceAfterDiscount &&
                product.priceAfterDiscount < product.price;
              const discount = hasDiscount
                ? Math.round(
                    ((product.price - product.priceAfterDiscount!) /
                      product.price) *
                      100,
                  )
                : 0;

              const isFavorited = wishlist.includes(product._id);

              return (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:-translate-y-2 duration-200 transition"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-sm z-10">
                        -{discount}%
                      </span>
                    )}

                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        width={300}
                        height={300}
                        unoptimized
                        loading="lazy"
                        className="w-full h-48 object-contain cursor-pointer"
                      />
                    </Link>

                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        disabled={loadingWishlistItems[product._id]}
                        className="bg-white p-1.5 cursor-pointer rounded-full shadow hover:text-red-600 transition"
                      >
                        <Heart
                          size={16}
                          fill={isFavorited ? "currentColor" : "none"}
                          className={`transition-colors ${
                            loadingWishlistItems[product._id]
                              ? "text-red-300 animate-pulse"
                              : isFavorited
                                ? "text-red-500"
                                : "text-gray-600"
                          }`}
                        />
                      </button>
                      <button className="bg-white p-1.5 rounded-full shadow hover:text-green-600 transition">
                        <RefreshCw size={16} className="text-gray-600" />
                      </button>
                      <Link href={`/products/${product._id}`}>
                        <button className="bg-white p-1.5 cursor-pointer rounded-full shadow hover:text-green-600 transition">
                          <Eye size={16} className="text-gray-600" />
                        </button>
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-1">
                    {product.category.name}
                  </p>

                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1 hover:text-green-600 cursor-pointer transition">
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
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <p className="text-green-600 font-bold text-sm">
                            {product.priceAfterDiscount} EGP
                          </p>
                          <p className="text-gray-400 font-medium text-xs line-through">
                            {product.price} EGP
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-800 font-bold text-sm">
                          {product.price} EGP
                        </p>
                      )}
                    </div>
                    {(() => {
                      const isItemLoading = loadingCartItems[product._id];
                      const isItemSuccess = successCartItems[product._id];

                      return (
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={isItemLoading || isItemSuccess}
                          className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center text-xl font-light
                            ${
                              isItemSuccess
                                ? "bg-green-700 text-white scale-110"
                                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                            }
                            ${isItemLoading ? "opacity-75 cursor-wait" : ""}
                          `}
                        >
                          {isItemLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : isItemSuccess ? (
                            <Check
                              size={20}
                              className="animate-in zoom-in duration-300"
                            />
                          ) : (
                            "+"
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
