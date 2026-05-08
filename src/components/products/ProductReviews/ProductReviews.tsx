"use client";

import { Product } from "@/types";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ProductReviews({ product }: { product: Product }) {
  type Tab = "details" | "reviews" | "shipping";

  const [activeTab, setActiveTab] = useState<Tab>("details");
  const reviews = product.reviews || [];
  const total = reviews.length;

  const starsCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter(
      (r: { rating: number }) => Math.round(r.rating) === star,
    ).length,
    percent:
      total > 0
        ? Math.round(
            (reviews.filter(
              (r: { rating: number }) => Math.round(r.rating) === star,
            ).length /
              total) *
              100,
          )
        : 0,
  }));
  return (
    <>
      <section className="py-8">
        <div className="container">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div>
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: "details", label: "Product Details" },
                    {
                      id: "reviews",
                      label: `Reviews (${product.ratingsQuantity})`,
                    },
                    { id: "shipping", label: "Shipping & Returns" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center border-gray-100 border-b-2 gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                          : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "details" && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About this Product
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Product Information
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-500">Category</span>
                            <span className="text-gray-900 font-medium">
                              {product.category.name}
                            </span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-500">Subcategory</span>
                            <span className="text-gray-900 font-medium">
                              {product.subcategory[0]?.name}
                            </span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-500">Brand</span>
                            <span className="text-gray-900 font-medium">
                              {product.brand.name}
                            </span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-500">Items Sold</span>
                            <span className="text-gray-900 font-medium">
                              {product.sold} + sold
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600 mr-2 w-4"
                            >
                              <path
                                d="M14.5141 1.91682C14.9051 2.20119 14.9926 2.74807 14.7083 3.13908L7.70825 12.7641C7.55786 12.9719 7.32544 13.1004 7.06841 13.1223C6.81138 13.1442 6.56255 13.0485 6.38208 12.868L2.88208 9.36799C2.54028 9.02619 2.54028 8.47111 2.88208 8.12932C3.22388 7.78752 3.77896 7.78752 4.12075 8.12932L6.89614 10.9047L13.2946 2.10822C13.579 1.71721 14.1258 1.62971 14.5168 1.91408L14.5141 1.91682Z"
                                fill="#16A34A"
                              />
                            </svg>
                            Premium Quality Product
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600 mr-2 w-4"
                            >
                              <path
                                d="M14.5141 1.91682C14.9051 2.20119 14.9926 2.74807 14.7083 3.13908L7.70825 12.7641C7.55786 12.9719 7.32544 13.1004 7.06841 13.1223C6.81138 13.1442 6.56255 13.0485 6.38208 12.868L2.88208 9.36799C2.54028 9.02619 2.54028 8.47111 2.88208 8.12932C3.22388 7.78752 3.77896 7.78752 4.12075 8.12932L6.89614 10.9047L13.2946 2.10822C13.579 1.71721 14.1258 1.62971 14.5168 1.91408L14.5141 1.91682Z"
                                fill="#16A34A"
                              />
                            </svg>
                            100% Authentic Guarantee
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600 mr-2 w-4"
                            >
                              <path
                                d="M14.5141 1.91682C14.9051 2.20119 14.9926 2.74807 14.7083 3.13908L7.70825 12.7641C7.55786 12.9719 7.32544 13.1004 7.06841 13.1223C6.81138 13.1442 6.56255 13.0485 6.38208 12.868L2.88208 9.36799C2.54028 9.02619 2.54028 8.47111 2.88208 8.12932C3.22388 7.78752 3.77896 7.78752 4.12075 8.12932L6.89614 10.9047L13.2946 2.10822C13.579 1.71721 14.1258 1.62971 14.5168 1.91408L14.5141 1.91682Z"
                                fill="#16A34A"
                              />
                            </svg>
                            Fast & Secure Packaging
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-green-600 mr-2 w-4"
                            >
                              <path
                                d="M14.5141 1.91682C14.9051 2.20119 14.9926 2.74807 14.7083 3.13908L7.70825 12.7641C7.55786 12.9719 7.32544 13.1004 7.06841 13.1223C6.81138 13.1442 6.56255 13.0485 6.38208 12.868L2.88208 9.36799C2.54028 9.02619 2.54028 8.47111 2.88208 8.12932C3.22388 7.78752 3.77896 7.78752 4.12075 8.12932L6.89614 10.9047L13.2946 2.10822C13.579 1.71721 14.1258 1.62971 14.5168 1.91408L14.5141 1.91682Z"
                                fill="#16A34A"
                              />
                            </svg>
                            Quality Tested
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "reviews" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 mb-2">
                            {product?.ratingsAverage}
                          </div>
                          <div className="flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={
                                  i < Math.round(product.ratingsAverage)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 fill-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Based on {product.ratingsQuantity} reviews
                          </p>
                        </div>
                        <div className="flex-1 w-full">
                          {starsCount.map(({ star, percent }) => (
                            <div
                              key={star}
                              className="flex items-center gap-3 mb-2"
                            >
                              <span className="text-sm text-gray-600 w-8">
                                {star} star
                              </span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-10">
                                {percent}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-6">
                        <div className="text-center py-8 flex flex-col items-center">
                          <Star
                            size={42}
                            className="text-[#D1D5DC] fill-[#D1D5DC] mb-3"
                          />
                          <p className="text-gray-500">
                            Customer reviews will be displayed here.
                          </p>
                          <button className="mt-4 text-green-600 hover:text-green-700 cursor-pointer font-medium">
                            Write a Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "shipping" && (
                  <>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                                <svg
                                  width="25"
                                  height="20"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.875 2.625C0.875 1.65977 1.65977 0.875 2.625 0.875H10.5C11.4652 0.875 12.25 1.65977 12.25 2.625V3.5H13.6363C14.1012 3.5 14.5469 3.6832 14.875 4.01133L16.1137 5.25C16.4418 5.57812 16.625 6.02383 16.625 6.48867V10.5C16.625 11.4652 15.8402 12.25 14.875 12.25H14.7848C14.5004 13.259 13.5707 14 12.4688 14C11.3668 14 10.4398 13.259 10.1527 12.25H7.34727C7.06289 13.259 6.1332 14 5.03125 14C3.9293 14 3.00234 13.259 2.71523 12.25H2.625C1.65977 12.25 0.875 11.4652 0.875 10.5V2.625ZM14.875 7.875V6.48867L13.6363 5.25H12.25V7.875H14.875ZM6.125 11.5938C6.125 11.3037 6.00977 11.0255 5.80465 10.8204C5.59953 10.6152 5.32133 10.5 5.03125 10.5C4.74117 10.5 4.46297 10.6152 4.25785 10.8204C4.05273 11.0255 3.9375 11.3037 3.9375 11.5938C3.9375 11.8838 4.05273 12.162 4.25785 12.3671C4.46297 12.5723 4.74117 12.6875 5.03125 12.6875C5.32133 12.6875 5.59953 12.5723 5.80465 12.3671C6.00977 12.162 6.125 11.8838 6.125 11.5938ZM12.4688 12.6875C12.7588 12.6875 13.037 12.5723 13.2421 12.3671C13.4473 12.162 13.5625 11.8838 13.5625 11.5938C13.5625 11.3037 13.4473 11.0255 13.2421 10.8204C13.037 10.6152 12.7588 10.5 12.4688 10.5C12.1787 10.5 11.9005 10.6152 11.6954 10.8204C11.4902 11.0255 11.375 11.3037 11.375 11.5938C11.375 11.8838 11.4902 12.162 11.6954 12.3671C11.9005 12.5723 12.1787 12.6875 12.4688 12.6875Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </div>
                              <h4 className="font-semibold text-gray-900">
                                Shipping Information
                              </h4>
                            </div>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>Free shipping on orders over $50</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>
                                  Standard delivery: 3-5 business days
                                </span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>
                                  Express delivery available (1-2 business days)
                                </span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>Track your order in real-time</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                                <svg
                                  width={25}
                                  height={20}
                                  data-prefix="fas"
                                  data-icon="rotate-left"
                                  className="svg-inline--fa fa-rotate-left text-xl"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  aria-hidden="true"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z"
                                  ></path>
                                </svg>
                              </div>
                              <h4 className="font-semibold text-gray-900">
                                Returns & Refunds
                              </h4>
                            </div>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>30-day hassle-free returns</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>Full refund or exchange available</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>
                                  Free return shipping on defective items
                                </span>
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <svg
                                  width="18"
                                  height="14"
                                  viewBox="0 0 18 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.5139 1.91682C14.9049 2.20119 14.9924 2.74807 14.708 3.13908L7.70801 12.7641C7.55762 12.9719 7.3252 13.1004 7.06816 13.1223C6.81113 13.1442 6.5623 13.0485 6.38184 12.868L2.88184 9.36799C2.54004 9.02619 2.54004 8.47111 2.88184 8.12932C3.22363 7.78752 3.77871 7.78752 4.12051 8.12932L6.8959 10.9047L13.2943 2.10822C13.5787 1.71721 14.1256 1.62971 14.5166 1.91408L14.5139 1.91682Z"
                                    fill="#16A34A"
                                  />
                                </svg>
                                <span>Easy online return process</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6 flex items-center gap-4">
                          <div className="h-14 w-14 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                            <svg
                              width={30}
                              height={24}
                              data-prefix="fas"
                              data-icon="shield-halved"
                              className="svg-inline--fa fa-shield-halved text-2xl"
                              role="img"
                              viewBox="0 0 512 512"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Buyer Protection Guarantee
                            </h4>
                            <p className="text-sm text-gray-600">
                              Get a full refund if your order doesn&apos;t
                              arrive or isn&apos;t as described. We ensure your
                              shopping experience is safe and secure.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
