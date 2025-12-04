"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Info,
  User,
  Calendar,
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
  checkedOutQuantity: number;
  photoUrl: string;
  categoryName: string;
}

interface CheckOutTransaction {
  id: string;
  userId: string;
  quantity: number;
  checkedOutQuantity: number;
  returnedQuantity: number;
  purpose: string;
  createdOn: string;
  createdBy: string;
}

interface CheckInData {
  checkOutTransactionId: string;
  quantity: number;
  condition: "GOOD" | "DAMAGED" | "LOST";
}

export default function CheckInProductPage() {
  const router = useRouter();
  // Safe to access directly now that the parent component is wrapped in <Suspense>
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId") ?? "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [checkOutTransactions, setCheckOutTransactions] = useState<
    CheckOutTransaction[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<CheckOutTransaction | null>(null);

  const [formData, setFormData] = useState<CheckInData>({
    checkOutTransactionId: "",
    quantity: 1,
    condition: "GOOD",
  });

  const organizationId = requireOrganizationId();

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

  const fetchCheckOutTransactions = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch(
        `/api/products/${productId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-organization-id": organizationId,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter for open check-out transactions
        const openCheckOuts =
          data.data?.content?.filter(
            (t: { transactionType: string; checkOutStatus: string }) =>
              t.transactionType === "CHECK_OUT" && t.checkOutStatus === "OPEN"
          ) || [];
        setCheckOutTransactions(openCheckOuts);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }, [productId, organizationId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCheckOutTransactions();
    }
    // Handle case where productId is missing (e.g., direct navigation without param)
    if (!productId && !loading) {
      toast.error("Missing product ID.");
      router.push("/products");
    }
  }, [productId, fetchProduct, fetchCheckOutTransactions, loading, router]);

  const handleTransactionSelect = (transactionId: string) => {
    const transaction = checkOutTransactions.find(
      (t) => t.id === transactionId
    );
    setSelectedTransaction(transaction || null);

    // Set quantity default to the maximum returnable amount
    const maxReturnable = transaction
      ? transaction.quantity - transaction.returnedQuantity
      : 1;

    setFormData((prev) => ({
      ...prev,
      checkOutTransactionId: transactionId,
      quantity: maxReturnable > 0 ? maxReturnable : 1,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks remain the same
    if (!formData.checkOutTransactionId) {
      toast.error("Please select a check-out transaction");
      return;
    }

    if (formData.quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (selectedTransaction) {
      const maxQuantity =
        selectedTransaction.quantity - selectedTransaction.returnedQuantity;
      if (formData.quantity > maxQuantity) {
        toast.error(`Cannot check in more than ${maxQuantity} items`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/products/${productId}/check-in`,
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
        const conditionMessage =
          formData.condition === "GOOD"
            ? "and returned to stock"
            : formData.condition === "DAMAGED"
              ? "and marked as damaged"
              : "and marked as lost";

        toast.success("Product checked in successfully!", {
          description: `${formData.quantity} ${product?.name} checked in ${conditionMessage}`,
        });

        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);
      } else if (response.status === 400) {
        toast.error("Check-in failed", {
          description:
            data.message || "Invalid request or quantity exceeds check-out",
        });
      } else if (response.status === 404) {
        toast.error("Transaction not found");
      } else {
        toast.error("Check-in failed", {
          description: data.message || "Please try again",
        });
      }
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("Check-in failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.checkOutTransactionId !== "" &&
    formData.quantity >= 1 &&
    selectedTransaction &&
    formData.quantity <=
    selectedTransaction.quantity - selectedTransaction.returnedQuantity;

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
    // This case should primarily be handled by the router.push on fetch failure,
    // but remains for robustness.
    return null;
  }

  // --- Component JSX structure remains the same as it is well-designed ---

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
          <h1 className="text-2xl font-bold text-gray-900">Check-In Item</h1>
          <p className="text-sm text-gray-500 mt-1">
            Return checked-out items and assess condition
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
                      <span className="text-xs font-semibold text-orange-600">
                        {product.checkedOutQuantity} Checked Out
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Select Check-Out Transaction */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Select Check-Out Transaction
                </h2>

                {checkOutTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-gray-600 font-semibold mb-2">
                      No Active Check-Outs
                    </p>
                    <p className="text-sm text-gray-500">
                      There are no items currently checked out for this product
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checkOutTransactions.map((transaction) => (
                      <label
                        key={transaction.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.checkOutTransactionId === transaction.id
                          ? "border-[#800020] bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="checkOutTransactionId"
                          value={transaction.id}
                          checked={
                            formData.checkOutTransactionId === transaction.id
                          }
                          onChange={() =>
                            handleTransactionSelect(transaction.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">
                              Transaction #{transaction.id.slice(0, 8)}
                            </span>
                            <span className="text-sm font-semibold text-orange-600">
                              {transaction.quantity -
                                transaction.returnedQuantity}{" "}
                              Items Out
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              User: {transaction.userId}
                            </p>
                            <p>Purpose: {transaction.purpose}</p>
                            <p className="text-xs text-gray-500">
                              Checked out:{" "}
                              {new Date(
                                transaction.createdOn
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Check-In Details */}
              {selectedTransaction && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Check-In Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity to Check In{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        max={
                          selectedTransaction.quantity -
                          selectedTransaction.returnedQuantity
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum returnable:{" "}
                        {selectedTransaction.quantity -
                          selectedTransaction.returnedQuantity}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Condition <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label
                          className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.condition === "GOOD"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <input
                            type="radio"
                            name="condition"
                            value="GOOD"
                            checked={formData.condition === "GOOD"}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <CheckCircle
                            className={`h-6 w-6 ${formData.condition === "GOOD"
                              ? "text-green-600"
                              : "text-gray-400"
                              }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Good
                            </p>
                            <p className="text-xs text-gray-600">
                              Return to stock
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.condition === "DAMAGED"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <input
                            type="radio"
                            name="condition"
                            value="DAMAGED"
                            checked={formData.condition === "DAMAGED"}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <AlertTriangle
                            className={`h-6 w-6 ${formData.condition === "DAMAGED"
                              ? "text-yellow-600"
                              : "text-gray-400"
                              }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Damaged
                            </p>
                            <p className="text-xs text-gray-600">
                              Needs repair
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.condition === "LOST"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <input
                            type="radio"
                            name="condition"
                            value="LOST"
                            checked={formData.condition === "LOST"}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <XCircle
                            className={`h-6 w-6 ${formData.condition === "LOST"
                              ? "text-red-600"
                              : "text-gray-400"
                              }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Lost
                            </p>
                            <p className="text-xs text-gray-600">
                              Not returned
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 text-sm mb-1">
                            Condition Impact
                          </h4>
                          <ul className="text-xs text-blue-800 space-y-1">
                            <li>
                              <strong>Good:</strong> Items will be added back to
                              available stock
                            </li>
                            <li>
                              <strong>Damaged:</strong> Items marked for repair,
                              not available
                            </li>
                            <li>
                              <strong>Lost:</strong> Items removed from total
                              inventory
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      Confirm Check-In
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary - Right Sidebar */}
          <div className="space-y-6">
            {/* Check-In Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Check-In Summary</h3>

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
                  <span className="text-gray-600">Condition:</span>
                  <span
                    className={`font-semibold ${formData.condition === "GOOD"
                      ? "text-green-600"
                      : formData.condition === "DAMAGED"
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    {formData.condition}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-bold text-gray-900">
                      {product.availableQuantity}
                    </span>
                  </div>
                  {formData.condition === "GOOD" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">After Check-In:</span>
                      <span className="font-bold text-green-600">
                        {product.availableQuantity + (formData.quantity || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 text-sm mb-2">
                Quick Tips
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Inspect items carefully before marking condition</li>
                <li>• Good condition items return to available stock</li>
                <li>• Damaged items can be repaired later</li>
                <li>• Lost items are removed from inventory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
