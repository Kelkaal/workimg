"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Info } from "lucide-react";
import type {
  CheckInFormData,
  CheckInItemData,
  ItemCondition,
} from "@/types/checkin";

export interface OpenCheckout {
  id: string;
  quantity: number;
  userId: string;
  userName?: string;
  createdOn: string;
  reason?: string;
}

interface CheckInAsideProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: CheckInItemData | null;
  onSubmit: (data: CheckInFormData) => void;
  openCheckouts?: OpenCheckout[];
}

const CONDITION_OPTIONS: ItemCondition[] = ["Good", "Fair", "Poor", "Damaged"];

export default function CheckInAside({
  isOpen,
  onClose,
  itemData,
  onSubmit,
  openCheckouts = [],
}: CheckInAsideProps) {
  const [selectedCheckout, setSelectedCheckout] = useState<OpenCheckout | null>(
    null
  );
  const [formData, setFormData] = useState<CheckInFormData>({
    itemName: itemData?.productName || "",
    quantityReturned: 1,
    userId: "",
    condition: "Good",
    notes: "",
    photos: itemData?.currentPhotos || [],
  });

  // Memoize the checkout selection logic
  const selectCheckout = useCallback((checkout: OpenCheckout | null) => {
    setSelectedCheckout(checkout);
    if (checkout) {
      setFormData((prev) => ({
        ...prev,
        quantityReturned: checkout.quantity,
        checkOutTransactionId: checkout.id,
        userId: checkout.userId,
      }));
    }
  }, []);

  // Auto-select checkout when panel opens
  useEffect(() => {
    if (!isOpen) {
      // Reset when closed
      setSelectedCheckout(null);
      setFormData((prev) => ({
        ...prev,
        quantityReturned: 1,
        condition: "Good",
        notes: "",
      }));
      return;
    }

    // Auto-select logic when panel opens
    if (openCheckouts.length === 1) {
      selectCheckout(openCheckouts[0]);
    } else if (openCheckouts.length > 1 && itemData?.checkOutTransactionId) {
      const checkout = openCheckouts.find(
        (c) => c.id === itemData.checkOutTransactionId
      );
      if (checkout) {
        selectCheckout(checkout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCheckoutSelect = (checkoutId: string) => {
    const checkout = openCheckouts.find((c) => c.id === checkoutId);
    if (checkout) {
      setSelectedCheckout(checkout);
      setFormData((prev) => ({
        ...prev,
        quantityReturned: checkout.quantity,
        checkOutTransactionId: checkout.id,
        userId: checkout.userId,
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen || !itemData) return null;

  const handleSubmit = () => {
    if (!selectedCheckout) return;
    onSubmit({
      ...formData,
      checkOutTransactionId: selectedCheckout.id,
    });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Aside Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[616px] bg-white z-50 overflow-y-auto shadow-xl">
        <div className="p-8 space-y-4">
          {/* Header */}
          <h2 className="text-xl font-normal text-[#111827]">Checkin Item</h2>

          {/* Item Information Section */}
          <div className="rounded-xl border border-[#E5E7EB] shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Info
                className="w-[18px] h-[18px] text-[#800020]"
                strokeWidth={2.5}
              />
              <h3 className="text-lg font-bold text-[#111827]">
                Item Information
              </h3>
            </div>

            <div className="space-y-5">
              {/* Item Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">
                  Item Name *
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="text-base text-[#111827]">
                    {itemData.productName}
                  </span>
                </div>
              </div>

              {/* Select Checkout Transaction - only show if multiple */}
              {openCheckouts.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">
                    Select Checkout to Return *
                  </label>
                  <div className="space-y-2">
                    {openCheckouts.map((checkout) => (
                      <div
                        key={checkout.id}
                        onClick={() => handleCheckoutSelect(checkout.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCheckout?.id === checkout.id
                            ? "border-[#800020] bg-[#800020]/5"
                            : "border-[#E5E7EB] hover:border-[#800020]/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-[#111827]">
                              {checkout.userName || "User"}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                              Qty: {checkout.quantity} •{" "}
                              {formatDate(checkout.createdOn)}
                            </p>
                            {checkout.reason && (
                              <p className="text-xs text-[#6B7280] mt-1">
                                Purpose: {checkout.reason}
                              </p>
                            )}
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedCheckout?.id === checkout.id
                                ? "border-[#800020] bg-[#800020]"
                                : "border-[#D1D5DB]"
                            }`}
                          >
                            {selectedCheckout?.id === checkout.id && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show selected checkout info if single */}
              {openCheckouts.length === 1 && selectedCheckout && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">
                    Checked Out By
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-base text-[#111827]">
                      {selectedCheckout.userName || "User"}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Qty: {selectedCheckout.quantity} •{" "}
                      {formatDate(selectedCheckout.createdOn)}
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity Returned */}
              <div className="space-y-2">
                <label className="text-sm font-normal text-[#374151]">
                  Quantity Returned
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCheckout?.quantity || 1}
                  value={formData.quantityReturned}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantityReturned: Math.min(
                        parseInt(e.target.value) || 1,
                        selectedCheckout?.quantity || 1
                      ),
                    }))
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#040404] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                />
                {selectedCheckout && (
                  <p className="text-xs text-[#6B7280]">
                    Max: {selectedCheckout.quantity} (checked out quantity)
                  </p>
                )}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">
                  Condition
                </label>
                <div className="relative">
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        condition: e.target.value as ItemCondition,
                      }))
                    }
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#040404] appearance-none focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent cursor-pointer"
                  >
                    {CONDITION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={4}
                  placeholder="Add any additional notes here..."
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-0 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-3 border border-[#D1D5DB] bg-white text-[#374151] text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedCheckout}
              className="px-6 py-3 bg-[#800020] text-white text-sm font-normal rounded-lg hover:bg-[#6a0019] transition-colors ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkin Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
