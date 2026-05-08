"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types";

interface AddressFormState {
  alias: string;
  details: string;
  phone: string;
  city: string;
}

interface AddressModalProps {
  open: boolean;
  isEditing: boolean;
  formState: AddressFormState;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof AddressFormState, value: string) => void;
  saving: boolean;
}

export function AddressModal({
  open,
  isEditing,
  formState,
  onClose,
  onSubmit,
  onChange,
  saving,
}: AddressModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update your saved delivery address."
                : "Add a new delivery address for faster checkout."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
          >
            <span className="sr-only">Close</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Name
            </label>
            <input
              value={formState.alias}
              onChange={(event) => onChange("alias", event.target.value)}
              placeholder="e.g. Home, Office"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              required
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <textarea
              value={formState.details}
              onChange={(event) => onChange("details", event.target.value)}
              placeholder="Street, building, floor, area"
              className="w-full min-h-28 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                value={formState.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
                type="tel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                value={formState.city}
                onChange={(event) => onChange("city", event.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-4 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl px-4 py-3"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Address"
                  : "Add Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
