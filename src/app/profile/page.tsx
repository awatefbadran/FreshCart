"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Address } from "@/types";
import { AddressCard } from "@/components/profile/AddressCard";
import { AddressModal } from "@/components/profile/AddressModal";

type SessionWithToken = {
  accessToken?: string;
  user?: { token?: string };
};

type AddressFormState = Omit<Address, "_id">;

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"settings" | "addresses">(
    "settings",
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState<AddressFormState>({
    alias: "",
    details: "",
    phone: "",
    city: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  type PasswordFormValues = {
    currentPassword: string;
    password: string;
    rePassword: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const token =
    Cookies.get("token") ||
    (session as SessionWithToken)?.user?.token ||
    (session as SessionWithToken)?.accessToken;

  useEffect(() => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    });
  }, [user]);

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      setLoadingAddresses(false);
      return;
    }

    setLoadingAddresses(true);
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        {
          headers: { token },
        },
      );
      const data = await res.json();
      if (data?.status === "success") {
        const normalized = Array.isArray(data.data)
          ? data.data
              .map((item: unknown) => {
                const address = item as Partial<Address> & { id?: string };
                return {
                  ...address,
                  _id: address._id ?? address.id ?? "",
                } as Address;
              })
              .filter((item: Address): item is Address => Boolean(item._id))
          : [];
        setAddresses(normalized);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Failed to load addresses", error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoadingAddresses(false);
      return;
    }

    void loadAddresses();
  }, [loadAddresses, token]);

  const handleTabChange = (tab: "settings" | "addresses") => {
    setActiveTab(tab);
    setAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleOpenAddressModal = (address?: Address) => {
    setEditingAddress(address ?? null);
    setAddressForm(
      address
        ? {
            alias: address.alias,
            details: address.details,
            phone: address.phone,
            city: address.city,
          }
        : {
            alias: "",
            details: "",
            phone: "",
            city: "",
          },
    );
    setAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm({ alias: "", details: "", phone: "", city: "" });
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    setSavingProfile(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.token = token;
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/users/updateMe",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
          }),
        },
      );
      const data = await res.json();
      if (data?.status === "success") {
        toast.success("Profile updated successfully.");
      } else {
        toast.error(data?.message || "Unable to update profile.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Update failed. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit: SubmitHandler<PasswordFormValues> = async (
    formValues,
  ) => {
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    setSavingPassword(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.token = token;
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            currentPassword: formValues.currentPassword,
            password: formValues.password,
            rePassword: formValues.rePassword,
          }),
        },
      );

      let parsedData: { status?: string; message?: string } | null = null;
      let responseText: string | null = null;

      try {
        parsedData = (await res.json()) as {
          status?: string;
          message?: string;
        };
      } catch {
        try {
          responseText = await res.text();
        } catch {
          responseText = null;
        }
      }

      if (res.status >= 200 && res.status < 300) {
        if (res.status === 204 || parsedData?.status === "success") {
          toast.success("Password changed successfully.");
          resetPasswordForm();
        } else {
          toast.error(
            parsedData?.message ||
              responseText ||
              `Password update returned ${res.status}.`,
          );
        }
      } else {
        toast.error(
          parsedData?.message ||
            responseText ||
            `Password update failed (${res.status} ${res.statusText})`,
        );
      }
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error("Password update failed.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    const { alias, details, phone, city } = addressForm;
    if (!alias.trim() || !details.trim() || !phone.trim() || !city.trim()) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (!/^[0-9+\-\s]{7,20}$/.test(phone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setSavingAddress(true);
    try {
      const isEditing = Boolean(editingAddress);
      const url = editingAddress
        ? `https://ecommerce.routemisr.com/api/v1/addresses/${editingAddress._id}`
        : "https://ecommerce.routemisr.com/api/v1/addresses";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ alias, details, phone, city }),
      });

      const data = await res.json();
      const payload = data?.data ?? data?.address ?? data;
      const addressResponse = payload?.address ?? payload;
      const addressId = addressResponse?._id ?? addressResponse?.id;
      const success = data?.status === "success";

      if (success) {
        if (addressResponse && addressId) {
          const normalizedAddress: Address = {
            ...addressResponse,
            _id: addressId,
            alias,
            details,
            phone,
            city,
          };

          if (isEditing) {
            setAddresses((prev) =>
              prev.map((item) =>
                item._id === addressId ? normalizedAddress : item,
              ),
            );
          } else {
            setAddresses((prev) => [normalizedAddress, ...prev]);
          }
        } else {
          await loadAddresses();
        }

        toast.success(
          isEditing
            ? "Address updated successfully."
            : "Address added successfully.",
        );
        handleCloseAddressModal();
      } else {
        toast.error(data?.message || "Unable to save address.");
      }
    } catch (error) {
      console.error("Failed to save address", error);
      toast.error("Unable to save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    if (!addressId) {
      toast.error("Invalid address selected.");
      return;
    }

    setDeletingAddressId(addressId);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: { token },
        },
      );
      const data = await res.json();
      if (data?.status === "success") {
        setAddresses((prev) => prev.filter((item) => item._id !== addressId));
        toast.success("Address removed.");
      } else {
        toast.error(data?.message || "Unable to delete address.");
      }
    } catch (error) {
      console.error("Delete address failed:", error);
      toast.error("Delete failed.");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const activeButtonClasses = (tab: "settings" | "addresses") =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left w-full ${
      activeTab === tab
        ? "bg-green-50 text-green-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const activeIconBackground = (tab: "settings" | "addresses") =>
    activeTab === tab ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link
              className="hover:text-white transition-colors duration-200"
              href="/"
            >
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">My Account</span>
          </nav>

          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <svg
                data-prefix="fas"
                data-icon="user"
                width="40"
                height="40"
                className="svg-inline--fa fa-user text-2xl"
                role="img"
                viewBox="0 0 448 512"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My Account
              </h1>
              <p className="text-white/80 mt-1">
                Manage your addresses and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Account</h2>
              </div>
              <div className="p-2 space-y-2">
                <button
                  type="button"
                  className={activeButtonClasses("addresses")}
                  onClick={() => handleTabChange("addresses")}
                >
                  <div
                    className={
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors " +
                      activeIconBackground("addresses")
                    }
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="location-dot"
                      width="14"
                      height="14"
                      className="svg-inline--fa fa-location-dot text-[0.65rem]"
                      role="img"
                      viewBox="0 0 384 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium flex-1">My Addresses</span>
                  <svg
                    data-prefix="fas"
                    data-icon="chevron-right"
                    width="12"
                    height="12"
                    className={`svg-inline--fa fa-chevron-right text-xs transition-transform ${
                      activeTab === "addresses"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                    role="img"
                    viewBox="0 0 320 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={activeButtonClasses("settings")}
                  onClick={() => handleTabChange("settings")}
                >
                  <div
                    className={
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors " +
                      activeIconBackground("settings")
                    }
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="gear"
                      width="14"
                      height="14"
                      className="svg-inline--fa fa-gear text-[0.65rem]"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium flex-1">Settings</span>
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === "addresses" ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      My Addresses
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Manage your saved delivery addresses
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddressModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25"
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="plus"
                      width="20"
                      height="20"
                      className="svg-inline--fa fa-plus text-sm"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                      />
                    </svg>
                    Add Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                    Loading addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                      <svg
                        data-prefix="fas"
                        data-icon="location-dot"
                        width="48"
                        height="48"
                        className="svg-inline--fa fa-location-dot text-3xl text-gray-400"
                        role="img"
                        viewBox="0 0 384 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No Addresses Yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Add your first delivery address to make checkout faster
                      and easier.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddressModal()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="plus"
                        width="20"
                        height="20"
                        className="svg-inline--fa fa-plus"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                        />
                      </svg>
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        onEdit={handleOpenAddressModal}
                        onDelete={handleDeleteAddress}
                        isDeleting={deletingAddressId === address._id}
                      />
                    ))}
                  </div>
                )}

                <AddressModal
                  open={addressModalOpen}
                  isEditing={Boolean(editingAddress)}
                  formState={addressForm}
                  onClose={handleCloseAddressModal}
                  onSubmit={handleAddressSubmit}
                  onChange={(field, value) =>
                    setAddressForm((prev) => ({ ...prev, [field]: value }))
                  }
                  saving={savingAddress}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Account Settings
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Update your profile information and change your password
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                        <svg
                          width={30}
                          height={24}
                          data-prefix="fas"
                          data-icon="user"
                          className="svg-inline--fa fa-user text-xl text-green-600"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Profile Information
                        </h3>
                        <p className="text-sm text-gray-500">
                          Update your personal details
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          value={profileData.name}
                          onChange={(event) =>
                            setProfileData((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                          required
                          type="text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          value={profileData.email}
                          onChange={(event) =>
                            setProfileData((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                          required
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          value={profileData.phone}
                          onChange={(event) =>
                            setProfileData((prev) => ({
                              ...prev,
                              phone: event.target.value,
                            }))
                          }
                          placeholder="01xxxxxxxxx"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                          required
                          type="tel"
                        />
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-600/25"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="p-6 sm:p-8 bg-gray-50">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">User ID</span>
                        <span className="font-mono text-gray-700">
                          69cd46c0460be8e0dbc87039
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Role</span>
                        <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium capitalize">
                          user
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                        <svg
                          width={30}
                          height={24}
                          data-prefix="fas"
                          data-icon="lock"
                          className="svg-inline--fa fa-lock text-2xl text-amber-600"
                          role="img"
                          viewBox="0 0 384 512"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Change Password
                        </h3>
                        <p className="text-sm text-gray-500">
                          Update your account password
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit(handlePasswordSubmit)}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            {...register("currentPassword", {
                              required: "Current password is required",
                            })}
                            placeholder="Enter your current password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            type="password"
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              data-prefix="fas"
                              data-icon="eye"
                              className="svg-inline--fa fa-eye"
                              role="img"
                              viewBox="0 0 576 512"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"
                              />
                            </svg>
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-sm text-red-600 mt-2">
                            {errors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            {...register("password", {
                              required: "New password is required",
                              minLength: {
                                value: 6,
                                message:
                                  "Password must be at least 6 characters",
                              },
                            })}
                            placeholder="Enter your new password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            type="password"
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              data-prefix="fas"
                              data-icon="eye"
                              className="svg-inline--fa fa-eye"
                              role="img"
                              viewBox="0 0 576 512"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"
                              />
                            </svg>
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600 mt-2">
                            {errors.password.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 6 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            {...register("rePassword", {
                              required: "Please confirm your new password",
                              validate: (value) =>
                                value === watch("password") ||
                                "Passwords do not match",
                            })}
                            placeholder="Confirm your new password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            type="password"
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              data-prefix="fas"
                              data-icon="eye"
                              className="svg-inline--fa fa-eye"
                              role="img"
                              viewBox="0 0 576 512"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"
                              />
                            </svg>
                          </button>
                        </div>
                        {errors.rePassword && (
                          <p className="text-sm text-red-600 mt-2">
                            {errors.rePassword.message}
                          </p>
                        )}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-lg shadow-amber-600/25"
                        >
                          {savingPassword ? "Saving..." : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
