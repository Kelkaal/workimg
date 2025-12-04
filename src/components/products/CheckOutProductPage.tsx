"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { requireOrganizationId } from "@/lib/orgUtils";

const PRIMARY_COLOR = "#800020";

interface Product {
  id: string;
  name: string;
  description: string;
  availableQuantity: number;
  photoUrl: string;
  categoryName: string;
}

interface CheckOutData {
  userId: string;
  quantity: number;
  purpose: string;
}

export default function CheckOutProductPage() {
  const router = useRouter();
  // Safe to access directly now that the parent component is wrapped in <Suspense>
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId") ?? null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<CheckOutData>({
    userId: "",
    quantity: 1,
    purpose: "",
  });

  const organizationId = requireOrganizationId();

  // ✅ Wrap fetchProduct in useCallback
  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-organization-id": organizationId,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
      } else {
        toast.error("Product not found");
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [productId, organizationId, router]);

  // ✅ Include fetchProduct in the dependency array
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    // Optional: Handle missing productId after hydration
    if (!productId && !loading) {
      toast.error("Missing product ID.");
      router.push("/products");
    }
  }, [productId, fetchProduct, loading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.userId.trim()) {
      toast.error("User ID is required");
      return;
    }

    if (formData.quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (!product || formData.quantity > product.availableQuantity) {
      toast.error("Insufficient quantity available");
      return;
    }

    if (!formData.purpose.trim()) {
      toast.error("Purpose is required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/products/${productId}/check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-organization-id": organizationId,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.status_code === 201) {
        toast.success("Product checked out successfully!", {
          description: `${formData.quantity} ${product?.name} checked out`,
        });

        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);
      } else if (response.status === 400) {
        toast.error("Check-out failed", {
          description:
            data.message || "Invalid request or insufficient quantity",
        });
      } else if (response.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Check-out failed", {
          description: data.message || "Please try again",
        });
      }
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error("Check-out failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.userId.trim() !== "" &&
    formData.quantity >= 1 &&
    formData.purpose.trim() !== "" &&
    product &&
    formData.quantity <= product.availableQuantity;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#800020]" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Check-Out Item</h1>
          <p className="text-sm text-gray-500 mt-1">
            Record item check-out and assign to user
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form - Left Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Item Information
                </h2>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                    {product.photoUrl ? (
                      <Image
                        src={product.photoUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Category: {product.categoryName}
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        {product.availableQuantity} Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID / Employee ID{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      placeholder="e.g., EMP-001 or user@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the users ID or email address
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to Check Out{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      max={product.availableQuantity}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum available: {product.availableQuantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Check-Out Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Check-Out Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose / Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="e.g., Client meeting, field work, maintenance, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Describe why this item is being checked out
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">
                          Check-Out Information
                        </h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Item will be marked as checked out</li>
                          <li>• Available quantity will be reduced</li>
                          <li>• User will be responsible for the item</li>
                          <li>• Check-in required to return items</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/products" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  disabled={!isFormValid || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Confirm Check-Out
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary - Right Sidebar */}
          <div className="space-y-6">
            {/* Check-Out Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Check-Out Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {product.name}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.quantity || 0}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User:</span>
                  <span className="font-semibold text-gray-900 text-right break-all">
                    {formData.userId || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Stock:</span>
                    <span className="font-bold text-gray-900">
                      {product.availableQuantity - (formData.quantity || 0)}
                    </span>
                  </div>
                </div>

                {product.availableQuantity - (formData.quantity || 0) < 10 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-800">
                        <span className="font-semibold">Low Stock Alert:</span>{" "}
                        Remaining quantity will be low after this check-out.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 text-sm mb-2">
                Quick Tips
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Double-check the user ID before confirming</li>
                <li>• Ensure the purpose is clearly stated</li>
                <li>• User must return items via check-in</li>
                <li>• Track check-outs in activity history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
