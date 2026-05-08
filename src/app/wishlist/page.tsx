"use client";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  addToCart,
  removeFromWishlist,
  getWishlistProducts,
} from "@/components/services/apiCall";
import { Product } from "@/types/index";
import PageLoader from "@/components/ui/PageLoader";

export default function WishlistPage() {
  const { setWishlist, wishlistCount } = useWishlist();
  const { refreshCart } = useCart();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCartItems, setLoadingCartItems] = useState<
    Record<string, boolean>
  >({});
  const [loadingRemoveItems, setLoadingRemoveItems] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        const res = await getWishlistProducts(token);
        if (res?.status === "success") {
          setProducts(res.data);
        }
      } catch {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [router]);

  const handleAddToCart = async (productId: string) => {
    const token =
      Cookies.get("token") || session?.user?.token || session?.accessToken;
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    setLoadingCartItems((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await addToCart(productId, token);
      if (res.status === "success") {
        toast.success("Added to cart!");
        refreshCart();
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoadingCartItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemove = async (productId: string) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    setLoadingRemoveItems((prev) => ({ ...prev, [productId]: true }));

    try {
      const data = await removeFromWishlist(productId, token);
      if (data?.status === "success") {
        setWishlist(data.data);
        setProducts((prev) =>
          prev.filter((product) => product._id !== productId),
        );
        toast.success("Removed from wishlist!");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to remove from wishlist.");
    } finally {
      setLoadingRemoveItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <svg
                width={25}
                height={20}
                viewBox="0 0 512 512"
                role="img"
                aria-hidden="true"
              >
                <path
                  fill="#EF4444"
                  d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
              <p className="text-gray-500 text-sm">
                {wishlistCount} items saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width={25} height={20} viewBox="0 0 512 512">
                <path
                  fill="#EF4444"
                  d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save items you love to your wishlist
            </p>
            <Link
              href="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-5 items-center hover:bg-gray-50/50 transition-colors"
                >
                  <div className="md:col-span-6 flex items-center gap-4">
                    <Link
                      href={`/products/${product._id}`}
                      className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0"
                    >
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain p-2"
                        width={62}
                        height={62}
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product._id}`}
                        className="font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2"
                      >
                        {product.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        {product.category.name}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                    <span className="md:hidden text-sm text-gray-500">
                      Price:
                    </span>
                    <div className="font-semibold text-gray-900">
                      {product.price} EGP
                    </div>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      In Stock
                    </span>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2 md:justify-center">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={loadingCartItems[product._id]}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 disabled:opacity-70 cursor-pointer"
                    >
                      {loadingCartItems[product._id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <svg
                          width={15}
                          height={12}
                          viewBox="0 0 640 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M24 32H72l17.8 99.8c2.6 14.5 15.4 25.2 30 25.2H520c17.7 0 32-14.3 32-32s-14.3-32-32-32H119.8L109.6 9.7C107.5-4.6 95.2-16 80.8-16H24C10.7-16 0-5.3 0 8s10.7 24 24 24zM208 480a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm224 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                          />
                        </svg>
                      )}
                      <span className="md:hidden lg:inline">Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={loadingRemoveItems[product._id]}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loadingRemoveItems[product._id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M135.2 17.7L120.8 0H31.1C13.9 0 0 13.9 0 31.1v33.8c0 17.2 13.9 31.1 31.1 31.1h15.9l22.2 371.4c1.6 26 23.3 46 49.4 46h245.9c26.2 0 47.8-19.9 49.4-46L401.9 96h15.8c17.2 0 31.1-13.9 31.1-31.1V31.1C448 13.9 434.1 0 416.9 0h-89.7l-14.4 17.7C308.7 25.7 300.9 32 291.9 32H156.1c-9 0-16.8-6.3-20.9-14.3z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/products"
            className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
