"use client";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "@/components/services/apiCall";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { Product } from "@/types/index";

export default function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const { data: session } = useSession();
  const { wishlist, setWishlist } = useWishlist();
  const { refreshCart } = useCart();

  const price = product.priceAfterDiscount || product.price;
  const totalPrice = (price * quantity).toFixed(2);
  const isFavorited = wishlist.includes(product._id);

  const handleQuantityChange = (val: number) => {
    const newQty = Math.min(Math.max(1, quantity + val), product.quantity);
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
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
    setLoadingCart(true);
    try {
      const res = await addToCart(product._id, token);
      if (res.status === "success") {
        toast.success(res.message || "Added to cart!");
        refreshCart();
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleToggleWishlist = async () => {
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
    setLoadingWishlist(true);
    try {
      let data;
      if (isFavorited) {
        data = await removeFromWishlist(product._id, token);
      } else {
        data = await addToWishlist(product._id, token);
      }
      if (data?.status === "success") {
        setWishlist(data.data);
        toast.success(data.message || "Wishlist updated!");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to update wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="px-4 py-3 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M3 8C3 7.44687 3.44687 7 4 7H16C16.5531 7 17 7.44687 17 8C17 8.55313 16.5531 9 16 9H4C3.44687 9 3 8.55313 3 8Z"
                  fill="#4A5565"
                />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    Math.max(1, Number(e.target.value)),
                    product.quantity,
                  ),
                )
              }
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-lg font-medium"
              min={1}
              max={product.quantity}
            />
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.quantity}
              className="px-4 py-3 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M11 2C11 1.44687 10.5531 1 10 1C9.44688 1 9 1.44687 9 2V7H4C3.44687 7 3 7.44688 3 8C3 8.55312 3.44687 9 4 9H9V14C9 14.5531 9.44688 15 10 15C10.5531 15 11 14.5531 11 14V9H16C16.5531 9 17 8.55312 17 8C17 7.44688 16.5531 7 16 7H11V2Z"
                  fill="#4A5565"
                />
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {product.quantity} available
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">Total Price:</div>
          <span className="text-2xl font-bold text-green-600">
            {totalPrice} EGP
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={loadingCart}
          className="flex-1 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-green-700 active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 bg-green-600 disabled:opacity-70"
        >
          {loadingCart ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none">
              <path
                d="M0.75 0C0.334375 0 0 0.334375 0 0.75C0 1.16562 0.334375 1.5 0.75 1.5H2.16563C2.2875 1.5 2.39062 1.5875 2.4125 1.70625L4.04063 10.6531C4.23438 11.7219 5.16563 12.5 6.25313 12.5H14.25C14.6656 12.5 15 12.1656 15 11.75C15 11.3344 14.6656 11 14.25 11H6.25313C5.89062 11 5.58125 10.7406 5.51562 10.3844L5.35625 9.5H14.8438C15.8062 9.5 16.6313 8.81563 16.8094 7.86875L17.7781 2.68438C17.8938 2.06875 17.4219 1.5 16.7938 1.5H3.89687L3.88438 1.4375C3.73438 0.60625 3.00937 0 2.1625 0H0.75ZM6.5 16.5C6.89782 16.5 7.27936 16.342 7.56066 16.0607C7.84196 15.7794 8 15.3978 8 15C8 14.6022 7.84196 14.2206 7.56066 13.9393C7.27936 13.658 6.89782 13.5 6.5 13.5C6.10218 13.5 5.72064 13.658 5.43934 13.9393C5.15804 14.2206 5 14.6022 5 15C5 15.3978 5.15804 15.7794 5.43934 16.0607C5.72064 16.342 6.10218 16.5 6.5 16.5ZM13.5 16.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15C15 14.6022 14.842 14.2206 14.5607 13.9393C14.2794 13.658 13.8978 13.5 13.5 13.5C13.1022 13.5 12.7206 13.658 12.4393 13.9393C12.158 14.2206 12 14.6022 12 15C12 15.3978 12.158 15.7794 12.4393 16.0607C12.7206 16.342 13.1022 16.5 13.5 16.5Z"
                fill="white"
              />
            </svg>
          )}
          Add to Cart
        </button>
        <button className="flex-1 cursor-pointer bg-gray-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <svg width="20" height="17" viewBox="0 0 20 17" fill="none">
            <path
              d="M13.5874 0.191152C13.9592 0.459902 14.0967 0.947402 13.928 1.3724L11.478 7.50053H15.9999C16.4217 7.50053 16.7967 7.76303 16.9405 8.1599C17.0842 8.55678 16.9624 9.00053 16.6405 9.26928L7.64048 16.7693C7.28735 17.063 6.78423 17.0787 6.41235 16.8099C6.04048 16.5412 5.90298 16.0537 6.07173 15.6287L8.52173 9.50053H3.99985C3.57798 9.50053 3.20298 9.23803 3.05923 8.84115C2.91548 8.44428 3.03735 8.00053 3.35923 7.73178L12.3592 0.231777C12.7124 -0.0619728 13.2155 -0.0775978 13.5874 0.191152Z"
              fill="white"
            />
          </svg>
          Buy Now
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleToggleWishlist}
          disabled={loadingWishlist}
          className={`group cursor-pointer flex-1 border-2 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
            isFavorited
              ? "flex-1 border-2 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 border-red-200 text-red-600 bg-red-50"
              : "border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600"
          }`}
        >
          {loadingWishlist ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isFavorited ? (
            <>
              <Heart size={18} fill="currentColor" />
              In Wishlist
            </>
          ) : (
            <>
              <Heart size={18} />
              Add to Wishlist
            </>
          )}
        </button>
        <button className="group border-2 cursor-pointer border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-green-300 hover:text-green-600 transition">
          <svg
            width="20"
            height="16"
            viewBox="0 0 20 16"
            fill="none"
            className="group-hover:fill-green-600"
          >
            <path
              d="M14 6C15.6562 6 17 4.65625 17 3C17 1.34375 15.6562 0 14 0C12.3438 0 11 1.34375 11 3C11 3.16875 11.0156 3.3375 11.0406 3.5L6.9875 5.75313C6.45938 5.28438 5.7625 5 5 5C3.34375 5 2 6.34375 2 8C2 9.65625 3.34375 11 5 11C5.7625 11 6.45625 10.7156 6.9875 10.2469L11.0406 12.5C11.0125 12.6625 11 12.8281 11 13C11 14.6562 12.3438 16 14 16C15.6562 16 17 14.6562 17 13C17 11.3438 15.6562 10 14 10C13.2375 10 12.5437 10.2844 12.0125 10.7531L7.95937 8.5C7.9875 8.3375 8 8.17188 8 8C8 7.82812 7.98438 7.6625 7.95937 7.5L12.0125 5.24687C12.5406 5.71562 13.2375 6 14 6Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
