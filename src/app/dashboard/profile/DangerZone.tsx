/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.staging.soma.emerj.net";

export default function DangerZone() {
  const router = useRouter();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeactivate = async () => {
    setIsProcessing(true);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // In production, this would call: PATCH /api/v1/users/me with { enabled: false }
      // For demo, we'll simulate it

      // Clear session
      localStorage.clear();
      sessionStorage.clear();

      alert("Account deactivated successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Deactivation error:", error);
      alert("Failed to deactivate account");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setIsProcessing(true);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      // In production, this would call: DELETE /api/v1/users/me
      // For demo, we'll simulate it

      // Clear all data
      localStorage.clear();
      sessionStorage.clear();

      alert("Account deleted successfully");
      router.push("/signup");
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Failed to delete account");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mt-1">
              Irreversible actions - proceed with caution
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Deactivate Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Deactivate Account
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Temporarily disable your account. You can reactivate anytime by
                logging in.
              </p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-amber-700 border border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
            >
              Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Delete Account
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Permanently delete your account and all data. This action cannot
                be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition active:scale-95"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Deactivate Account
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to deactivate your account?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                Your account will be temporarily disabled. You can reactivate it
                anytime by logging back in.
              </p>
              <ul className="mt-2 text-xs text-amber-700 space-y-1 list-disc list-inside">
                <li>Your profile will not be visible to others</li>
                <li>You wont receive notifications</li>
                <li>All your data will be preserved</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-amber-600 rounded-lg text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {isProcessing ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 font-semibold mb-2">
                Warning: This will permanently delete:
              </p>
              <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                <li>Your profile and personal information</li>
                <li>All your products and inventory data</li>
                <li>Transaction history and reports</li>
                <li>Categories and custom settings</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing || confirmText !== "DELETE"}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
