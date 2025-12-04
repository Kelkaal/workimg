"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import type { CheckOutFormData, CheckOutItemData } from "@/types/checkin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface CheckOutAsideProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: CheckOutItemData | null;
  onSubmit: (data: CheckOutFormData) => void;
}

export default function CheckOutAside({
  isOpen,
  onClose,
  itemData,
  onSubmit,
}: CheckOutAsideProps) {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState<CheckOutFormData>({
    quantity: 1,
    userId: "", // user ID will be stored here
    purpose: "",
  });

  // Helper to decode JWT and get user info
  const getCurrentUserFromToken = () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return null;

      // Decode JWT payload (base64)
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));

      return {
        id: decoded.userId || decoded.sub,
        name:
          decoded.fullName || decoded.name || decoded.email || "Current User",
      };
    } catch {
      return null;
    }
  };

  // Fetch all users when aside opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const orgId =
          sessionStorage.getItem("organizationId") ||
          localStorage.getItem("organizationId");
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        console.log("Fetching users for org:", orgId);

        const res = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${orgId}/users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        console.log("Users response:", json);

        if (!res.ok) {
          // API failed, use current user as fallback
          const currentUser = getCurrentUserFromToken();
          if (currentUser) {
            console.log("Using current user as fallback:", currentUser);
            setUsers([currentUser]);
            setFormData((prev) => ({ ...prev, userId: currentUser.id }));
          }
          return;
        }

        const userList = json.data?.content || json.data || [];
        const formatted = userList.map(
          (u: { id: string; name: string; fullName?: string }) => ({
            id: u.id,
            name: u.fullName || u.name || "Unknown User",
          })
        );

        console.log("Formatted users:", formatted);

        // If no users from API, use current user
        if (formatted.length === 0) {
          const currentUser = getCurrentUserFromToken();
          if (currentUser) {
            formatted.push(currentUser);
          }
        }

        setUsers(formatted);

        // Pre-select first user
        if (formatted.length > 0) {
          setFormData((prev) => ({ ...prev, userId: formatted[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        // Use current user as fallback on error
        const currentUser = getCurrentUserFromToken();
        if (currentUser) {
          setUsers([currentUser]);
          setFormData((prev) => ({ ...prev, userId: currentUser.id }));
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  if (!isOpen || !itemData) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[616px] bg-white z-50 overflow-y-auto shadow-xl">
        <div className="p-8 space-y-4">
          <h2 className="text-xl font-normal text-[#111827]">Checkout Item</h2>

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

              <div className="space-y-2">
                <label className="text-sm font-normal text-[#374151]">
                  Quantity To Take
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg"
                />
              </div>

              {/* Taken by */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">
                  Taken by *
                </label>
                <div className="relative">
                  <select
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    disabled={loadingUsers}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingUsers ? "Loading users..." : "Select a user"}
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!loadingUsers && users.length === 0 && (
                  <p className="text-xs text-red-500">
                    No users found in this organization
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">
                  Purpose
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  placeholder="Reason"
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-0 pt-2">
            <button
              onClick={onClose}
              className="px-4 flex items-center gap-1 py-3 border border-[#D1D5DB] bg-white rounded-lg"
            >
              <X className="w-3.5 h-3.5  text-[#374151] " strokeWidth={2.5} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 flex items-center gap-1 py-3 bg-[#800020] text-white rounded-lg ml-4"
            >
              Checkout Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
