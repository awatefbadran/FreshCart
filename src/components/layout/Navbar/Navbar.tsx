"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Menu,
  Search,
  HelpCircle,
  LogOut,
 
} from "lucide-react";
import Image from "next/image";
import { removeToken } from "@/lib/auth";
import { signOut } from "next-auth/react";
import WishlistIcon from "@/components/home/WishlistIcon";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  {
    href: "/categories",
    label: "Categories",
    isDropdown: true,
  },
  { href: "/brands", label: "Brands" },
];

export default function Navbar() {
  const [showTop, setShowTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const handleLogout = () => {
    removeToken();
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY < 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  return (
    <>
      <div
        className={`bg-white border-b hidden lg:block border-gray-100 text-sm transition-all duration-500 overflow-hidden ${
          showTop ? "h-10 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-5 text-gray-500">
            <span className="hidden sm:flex items-center gap-1.5">
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.75 2.25C0.75 1.42266 1.42266 0.75 2.25 0.75H9C9.82734 0.75 10.5 1.42266 10.5 2.25V3H11.6883C12.0867 3 12.4688 3.15703 12.75 3.43828L13.8117 4.5C14.093 4.78125 14.25 5.16328 14.25 5.56172V9C14.25 9.82734 13.5773 10.5 12.75 10.5H12.6727C12.4289 11.3648 11.632 12 10.6875 12C9.74297 12 8.94844 11.3648 8.70234 10.5H6.29766C6.05391 11.3648 5.25703 12 4.3125 12C3.36797 12 2.57344 11.3648 2.32734 10.5H2.25C1.42266 10.5 0.75 9.82734 0.75 9V2.25ZM12.75 6.75V5.56172L11.6883 4.5H10.5V6.75H12.75ZM5.25 9.9375C5.25 9.68886 5.15123 9.4504 4.97541 9.27459C4.7996 9.09877 4.56114 9 4.3125 9C4.06386 9 3.8254 9.09877 3.64959 9.27459C3.47377 9.4504 3.375 9.68886 3.375 9.9375C3.375 10.1861 3.47377 10.4246 3.64959 10.6004C3.8254 10.7762 4.06386 10.875 4.3125 10.875C4.56114 10.875 4.7996 10.7762 4.97541 10.6004C5.15123 10.4246 5.25 10.1861 5.25 9.9375ZM10.6875 10.875C10.9361 10.875 11.1746 10.7762 11.3504 10.6004C11.5262 10.4246 11.625 10.1861 11.625 9.9375C11.625 9.68886 11.5262 9.4504 11.3504 9.27459C11.1746 9.09877 10.9361 9 10.6875 9C10.4389 9 10.2004 9.09877 10.0246 9.27459C9.84877 9.4504 9.75 9.68886 9.75 9.9375C9.75 10.1861 9.84877 10.4246 10.0246 10.6004C10.2004 10.7762 10.4389 10.875 10.6875 10.875Z"
                  fill="#16A34A"
                />
              </svg>
              Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.03516 1.6125C9.21328 1.31016 9.53672 1.125 9.88594 1.125H9.9375C10.4555 1.125 10.875 1.54453 10.875 2.0625C10.875 2.58047 10.4555 3 9.9375 3H8.21953L9.03516 1.6125ZM5.96484 1.6125L6.78047 3H5.0625C4.54453 3 4.125 2.58047 4.125 2.0625C4.125 1.54453 4.54453 1.125 5.0625 1.125H5.11406C5.46328 1.125 5.78906 1.31016 5.96484 1.6125ZM8.06484 1.04297L7.5 2.00391L6.93516 1.04297C6.55547 0.396094 5.86172 0 5.11406 0H5.0625C3.92344 0 3 0.923438 3 2.0625C3 2.4 3.08203 2.71875 3.225 3H2.25C1.83516 3 1.5 3.33516 1.5 3.75V4.5C1.5 4.91484 1.83516 5.25 2.25 5.25H12.75C13.1648 5.25 13.5 4.91484 13.5 4.5V3.75C13.5 3.33516 13.1648 3 12.75 3H11.775C11.918 2.71875 12 2.4 12 2.0625C12 0.923438 11.0766 0 9.9375 0H9.88594C9.13828 0 8.44453 0.396094 8.06484 1.04063V1.04297ZM12.75 6.375H8.0625V11.25H11.25C12.0773 11.25 12.75 10.5773 12.75 9.75V6.375ZM6.9375 6.375H2.25V9.75C2.25 10.5773 2.92266 11.25 3.75 11.25H6.9375V6.375Z"
                  fill="#16A34A"
                />
              </svg>
              New Arrivals Daily
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-gray-500">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
            >
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25469 0.586223C5.06953 0.143254 4.58672 -0.0911211 4.12735 0.0330976L3.99844 0.0682539C2.48438 0.480754 1.19063 1.94794 1.56797 3.73388C2.4375 7.83544 5.66485 11.0628 9.76641 11.9323C11.5547 12.312 13.0195 11.0159 13.432 9.50185L13.4672 9.37294C13.5938 8.91122 13.357 8.42841 12.9164 8.2456L10.6359 7.29638C10.2492 7.13466 9.80157 7.24716 9.53438 7.57294L8.62969 8.67919C6.98203 7.86122 5.65547 6.49247 4.89375 4.812L5.92969 3.96825C6.25547 3.70341 6.36563 3.25575 6.20625 2.86669L5.25469 0.586223Z"
                  fill="#6A7282"
                />
              </svg>
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
            >
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.93906 1.5C2.14453 1.5 1.5 2.14453 1.5 2.93906C1.5 2.96016 1.5 2.97891 1.50234 3H1.5V9C1.5 9.82734 2.17266 10.5 3 10.5H12C12.8273 10.5 13.5 9.82734 13.5 9V3H13.4977C13.4977 2.97891 13.5 2.96016 13.5 2.93906C13.5 2.14453 12.8555 1.5 12.0609 1.5H2.93906ZM12.375 4.50703V9C12.375 9.20625 12.2063 9.375 12 9.375H3C2.79375 9.375 2.625 9.20625 2.625 9V4.50703L6.25313 7.25859C6.98906 7.81875 8.00859 7.81875 8.74688 7.25859L12.375 4.50703ZM2.625 2.93906C2.625 2.76562 2.76562 2.625 2.93906 2.625H12.0609C12.2344 2.625 12.375 2.76562 12.375 2.93906C12.375 3.0375 12.3281 3.13125 12.2508 3.18984L8.06719 6.36328C7.73203 6.61641 7.26797 6.61641 6.93281 6.36328L2.74922 3.18984C2.67188 3.13125 2.625 3.0375 2.625 2.93906Z"
                  fill="#6A7282"
                />
              </svg>
              support@freshcart.com
            </a>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-1 text-gray-600 text-sm"
                >
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.625 3C5.625 2.50272 5.82254 2.02581 6.17417 1.67417C6.52581 1.32254 7.00272 1.125 7.5 1.125C7.99728 1.125 8.47419 1.32254 8.82583 1.67417C9.17746 2.02581 9.375 2.50272 9.375 3C9.375 3.49728 9.17746 3.97419 8.82583 4.32583C8.47419 4.67746 7.99728 4.875 7.5 4.875C7.00272 4.875 6.52581 4.67746 6.17417 4.32583C5.82254 3.97419 5.625 3.49728 5.625 3ZM10.5 3C10.5 2.20435 10.1839 1.44129 9.62132 0.87868C9.05871 0.316071 8.29565 0 7.5 0C6.70435 0 5.94129 0.316071 5.37868 0.87868C4.81607 1.44129 4.5 2.20435 4.5 3C4.5 3.79565 4.81607 4.55871 5.37868 5.12132C5.94129 5.68393 6.70435 6 7.5 6C8.29565 6 9.05871 5.68393 9.62132 5.12132C10.1839 4.55871 10.5 3.79565 10.5 3ZM3.375 11.25C3.375 9.59297 4.71797 8.25 6.375 8.25H8.625C10.282 8.25 11.625 9.59297 11.625 11.25V11.4375C11.625 11.7492 11.8758 12 12.1875 12C12.4992 12 12.75 11.7492 12.75 11.4375V11.25C12.75 8.97188 10.9031 7.125 8.625 7.125H6.375C4.09688 7.125 2.25 8.97188 2.25 11.25V11.4375C2.25 11.7492 2.50078 12 2.8125 12C3.12422 12 3.375 11.7492 3.375 11.4375V11.25Z"
                      fill="#4A5565"
                    />
                  </svg>
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors text-sm text-gray-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.625 3C5.625 2.50272 5.82254 2.02581 6.17417 1.67417C6.52581 1.32254 7.00272 1.125 7.5 1.125C7.99728 1.125 8.47419 1.32254 8.82583 1.67417C9.17746 2.02581 9.375 2.50272 9.375 3C9.375 3.49728 9.17746 3.97419 8.82583 4.32583C8.47419 4.67746 7.99728 4.875 7.5 4.875C7.00272 4.875 6.52581 4.67746 6.17417 4.32583C5.82254 3.97419 5.625 3.49728 5.625 3ZM10.5 3C10.5 2.20435 10.1839 1.44129 9.62132 0.87868C9.05871 0.316071 8.29565 0 7.5 0C6.70435 0 5.94129 0.316071 5.37868 0.87868C4.81607 1.44129 4.5 2.20435 4.5 3C4.5 3.79565 4.81607 4.55871 5.37868 5.12132C5.94129 5.68393 6.70435 6 7.5 6C8.29565 6 9.05871 5.68393 9.62132 5.12132C10.1839 4.55871 10.5 3.79565 10.5 3ZM3.375 11.25C3.375 9.59297 4.71797 8.25 6.375 8.25H8.625C10.282 8.25 11.625 9.59297 11.625 11.25V11.4375C11.625 11.7492 11.8758 12 12.1875 12C12.4992 12 12.75 11.7492 12.75 11.4375V11.25C12.75 8.97188 10.9031 7.125 8.625 7.125H6.375C4.09688 7.125 2.25 8.97188 2.25 11.25V11.4375C2.25 11.7492 2.50078 12 2.8125 12C3.12422 12 3.375 11.7492 3.375 11.4375V11.25Z"
                      fill="#4A5565"
                    />
                  </svg>
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <User size={13} /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container py-3 flex items-center justify-between h-16 lg:h-18 gap-4 lg:gap-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/freshcart-logo.svg"
              alt="FreshCart"
              width={130}
              height={36}
              className="h-6 lg:h-8 w-auto"
              priority
            />
          </Link>

          <form className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 18 14" fill="none">
                  <path
                    d="M13.125 5.6875C13.125 6.94258 12.7176 8.10195 12.0312 9.04258L15.493 12.507C15.8348 12.8488 15.8348 13.4039 15.493 13.7457C15.1512 14.0875 14.5961 14.0875 14.2543 13.7457L10.7926 10.2812C9.85195 10.9676 8.69258 11.375 7.4375 11.375C4.2957 11.375 1.75 8.8293 1.75 5.6875C1.75 2.5457 4.2957 0 7.4375 0C10.5793 0 13.125 2.5457 13.125 5.6875ZM7.4375 9.625C8.47949 9.625 9.47831 9.21094 10.2217 8.47173C10.9651 7.73252 11.375 6.72949 11.375 5.6875C11.375 4.64551 10.9651 3.64248 10.2217 2.90327C9.47831 2.16406 8.47949 1.75 7.4375 1.75C6.39551 1.75 5.39669 2.16406 4.65327 2.90327C3.90985 3.64248 3.5 4.64551 3.5 5.6875C3.5 6.72949 3.90985 7.73252 4.65327 8.47173C5.39669 9.21094 6.39551 9.625 7.4375 9.625Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  {link.label}
                  {link.isDropdown && (
                    <svg
                      data-prefix="fas"
                      data-icon="chevron-down"
                      className="w-[12.5px] h-2.5 text-[10px] transition-transform duration-200 group-hover:rotate-180"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      ></path>
                    </svg>
                  )}
                </Link>

                {link.isDropdown && (
                  <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-60">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-50">
                      <Link
                        className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        href="/categories"
                      >
                        All Categories
                      </Link>
                      <Link
                        className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        href="/products?category=6439d58a0049ad0b52b9003f"
                      >
                        Electronics
                      </Link>
                      <Link
                        className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        href="/products?category=6439d5b90049ad0b52b90048"
                      >
                        Women&apos;s Fashion
                      </Link>
                      <Link
                        className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        href="/products?category=6439d2d167d9aa4ca970649f"
                      >
                        Men&apos;s Fashion
                      </Link>
                      <Link
                        className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        href="/products?category=6439d40367d9aa4ca97064a8"
                      >
                        Beauty & Health
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
            <div className="hidden xl:flex items-center gap-2 mr-1">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2C7.53125 2 5.47813 3.79062 5.07188 6.14687C5.3625 6.05312 5.675 6 6 6H6.5C7.32812 6 8 6.67188 8 7.5V10.5C8 11.3281 7.32812 12 6.5 12H6C4.34375 12 3 10.6562 3 9V7C3 3.13438 6.13438 0 10 0C13.8656 0 17 3.13438 17 7V12.2531C17 14.325 15.3188 16.0031 13.2469 16.0031L10.5 16H9.5C8.67188 16 8 15.3281 8 14.5C8 13.6719 8.67188 13 9.5 13H10.5C11.3281 13 12 13.6719 12 14.5H13.25C14.4937 14.5 15.5 13.4937 15.5 12.25V11.5969C15.0594 11.8531 14.5469 11.9969 14 11.9969H13.5C12.6719 11.9969 12 11.325 12 10.4969V7.49687C12 6.66875 12.6719 5.99687 13.5 5.99687H14C14.325 5.99687 14.6344 6.04688 14.9281 6.14375C14.5219 3.79063 12.4719 1.99688 10 1.99688V2Z"
                    fill="#16A34A"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="text-xs text-gray-400">Support</p>
                <p className="text-xs font-semibold text-gray-700">24/7 Help</p>
              </div>
            </div>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <WishlistIcon />
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <svg
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svg-inline--fa fa-cart-shopping text-xl text-gray-500 group-hover:text-green-600 transition-colors"
              >
                <path
                  d="M0.9375 0C0.417969 0 0 0.417969 0 0.9375C0 1.45703 0.417969 1.875 0.9375 1.875H2.70703C2.85938 1.875 2.98828 1.98438 3.01562 2.13281L5.05078 13.3164C5.29297 14.6523 6.45703 15.625 7.81641 15.625H17.8125C18.332 15.625 18.75 15.207 18.75 14.6875C18.75 14.168 18.332 13.75 17.8125 13.75H7.81641C7.36328 13.75 6.97656 13.4258 6.89453 12.9805L6.69531 11.875H18.5547C19.7578 11.875 20.7891 11.0195 21.0117 9.83594L22.2227 3.35547C22.3672 2.58594 21.7773 1.875 20.9922 1.875H4.87109L4.85547 1.79688C4.66797 0.757812 3.76172 0 2.70312 0H0.9375ZM8.125 20.625C8.62228 20.625 9.09919 20.4275 9.45083 20.0758C9.80246 19.7242 10 19.2473 10 18.75C10 18.2527 9.80246 17.7758 9.45083 17.4242C9.09919 17.0725 8.62228 16.875 8.125 16.875C7.62772 16.875 7.15081 17.0725 6.79917 17.4242C6.44754 17.7758 6.25 18.2527 6.25 18.75C6.25 19.2473 6.44754 19.7242 6.79917 20.0758C7.15081 20.4275 7.62772 20.625 8.125 20.625ZM16.875 20.625C17.3723 20.625 17.8492 20.4275 18.2008 20.0758C18.5525 19.7242 18.75 19.2473 18.75 18.75C18.75 18.2527 18.5525 17.7758 18.2008 17.4242C17.8492 17.0725 17.3723 16.875 16.875 16.875C16.3777 16.875 15.9008 17.0725 15.5492 17.4242C15.1975 17.7758 15 18.2527 15 18.75C15 19.2473 15.1975 19.7242 15.5492 20.0758C15.9008 20.4275 16.3777 20.625 16.875 20.625Z"
                  fill="currentColor"
                />
              </svg>

              <span className="absolute top-0.5 right-0.5 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <Link
                href="/account"
                className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:shadow-sm transition-all"
              >
                <User size={14} /> My Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all"
              >
                <User size={14} /> Sign In
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden ml-1 w-10 h-10 rounded-full bg-green-600 cursor-pointer hover:bg-green-700 text-white flex items-center justify-center transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-60 bg-black/50  transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`lg:hidden fixed top-0 right-0 z-70 h-full w-75 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center bg-[#FBFCFD] justify-between px-5 py-4 border-b border-gray-100">
          <Image
            src="/freshcart-logo.svg"
            alt="FreshCart"
            width={160}
            height={31}
            className="w-auto h-8"
          />
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all"
          >
            <span className="rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors w-9 h-9">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M5.72178 2.29374C5.33115 1.90312 4.69678 1.90312 4.30615 2.29374C3.91553 2.68437 3.91553 3.31874 4.30615 3.70937L8.5999 7.99999L4.30928 12.2937C3.91865 12.6844 3.91865 13.3187 4.30928 13.7094C4.6999 14.1 5.33428 14.1 5.7249 13.7094L10.0155 9.41562L14.3093 13.7062C14.6999 14.0969 15.3343 14.0969 15.7249 13.7062C16.1155 13.3156 16.1155 12.6812 15.7249 12.2906L11.4312 7.99999L15.7218 3.70624C16.1124 3.31562 16.1124 2.68124 15.7218 2.29062C15.3312 1.89999 14.6968 1.89999 14.3062 2.29062L10.0155 6.58437L5.72178 2.29374Z"
                  fill="#4A5565"
                />
              </svg>
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center">
                <Search size={13} />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="px-4 border-b border-gray-100">
              <div className="py-4 space-y-1">
                <Link
                  href={`/account`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                      <User size={18} className="text-sky-500" />
                    </div>
                    <span className="font-medium text-gray-700">
                      My Profile
                    </span>
                  </div>
                </Link>
                <Link
                  href={`/orders`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">My Orders</span>
                </Link>
                <Link
                  href={`/wishlist`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">My Wishlist</span>
                  <span className="bg-red-500 py-1 px-2.5 rounded-full text-white text-[11px] font-bold">
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  href={`/account#addresses`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">Addresses</span>
                </Link>
                <Link
                  href={`/account#settings`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">Settings</span>
                </Link>
              </div>
            </div>
          )}

          <div className="p-4">
            {user ? (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                >
                  <div className="bg-[#FEF2F2] w-9 h-9 rounded-full flex items-center justify-center">
                    <LogOut size={18} className="text-[#FB2C36]" />
                  </div>
                  <span className="font-medium text-[#E7000B]">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/login`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#15803d] text-white font-semibold hover:bg-[#16A34A] transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href={`/register`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl border-2 border-[#16a34a] text-[#16a34a] font-semibold hover:bg-[#16a34a] hover:text-white transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Need Help Section */}
          <Link
            href={`/contact`}
            onClick={() => setMenuOpen(false)}
            className="mx-4 mt-2 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-green-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <HelpCircle size={20} className="text-[#16A34A]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#364153]">
                Need Help?
              </div>
              <div className="text-xs text-[#16A34A]">Contact Support</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
