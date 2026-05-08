"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, RefreshCw, Eye, Loader2, Check } from "lucide-react";
import {
  getProducts,
  addToWishlist,
  removeFromWishlist,
} from "@/components/services/apiCall";
import { Product } from "@/types/index";
import PageLoader from "@/components/ui/PageLoader";
import SectionHeader from "./SectionHeader";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { addToCart } from "@/components/services/apiCall";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCartItems, setLoadingCartItems] = useState<
    Record<string, boolean>
  >({});
  const [successCartItems, setSuccessCartItems] = useState<
    Record<string, boolean>
  >({});
  const [loadingWishlistItems, setLoadingWishlistItems] = useState<
    Record<string, boolean>
  >({});
  const { data: session } = useSession();

  const { wishlist, setWishlist } = useWishlist();
  const { refreshCart } = useCart();

  useEffect(() => {
    getProducts(80)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

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
        ? wishlist.filter((id) => id !== productId)
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
    } catch (error) {
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
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoadingCartItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <section className="container py-8">
      <SectionHeader
        title="Featured"
        highlight="Products"
        href="/products"
        linkLabel="View All Products"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
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
              className="border border-gray-200 rounded-xl p-3 hover:shadow-md hover:-translate-y-2 duration-200 transition"
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
    </section>
  );
}
