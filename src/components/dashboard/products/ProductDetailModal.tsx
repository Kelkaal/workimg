"use client";

import { useState, useEffect } from "react";
import {
  X,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  Edit2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { useProductStore } from "@/stores/productStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface TransactionStats {
  totalCheckIns: number;
  totalCheckOuts: number;
  openCheckOuts: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onCheckIn: (productId: string) => void;
  onCheckOut: (productId: string) => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onCheckIn,
  onCheckOut,
}: ProductDetailModalProps) {
  const router = useRouter();
  const { deleteProduct, fetchProducts } = useProductStore();
  const [stats, setStats] = useState<TransactionStats>({
    totalCheckIns: 0,
    totalCheckOuts: 0,
    openCheckOuts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (product) {
      router.push(`/dashboard/products/edit/${product.id}`);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      const success = await deleteProduct(product.id);
      if (success) {
        toast.success("Product deleted successfully");
        onClose();
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !product) return;

    const fetchTransactionStats = async () => {
      setLoading(true);
      try {
        const orgId =
          sessionStorage.getItem("organizationId") ||
          localStorage.getItem("organizationId");
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const res = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${product.id}/transactions?page=0&size=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch transactions");

        const json = await res.json();
        const transactions = json.data?.content || [];

        // Calculate stats
        const checkIns = transactions.filter(
          (t: { transactionType: string }) => t.transactionType === "CHECK_IN"
        ).length;
        const checkOuts = transactions.filter(
          (t: { transactionType: string }) => t.transactionType === "CHECK_OUT"
        ).length;
        const openCheckOuts = transactions.filter(
          (t: { transactionType: string; checkOutStatus: string }) =>
            t.transactionType === "CHECK_OUT" && t.checkOutStatus === "OPEN"
        ).length;

        setStats({
          totalCheckIns: checkIns,
          totalCheckOuts: checkOuts,
          openCheckOuts: openCheckOuts,
        });
      } catch (error) {
        console.error("Failed to fetch transaction stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStats();
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
            <h2 className="text-xl font-semibold text-[#111827]">
              Product Details
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit product"
              >
                <Edit2 className="w-5 h-5 text-[#6B7280]" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete product"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={product.image || "/placeholder-product.png"}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#6B7280]">{product.sku}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <p className="text-sm text-[#374151]">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Category */}
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm text-[#6B7280]">
                  {product.category}
                </span>
              </div>

              {/* Quantity Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#111827]">
                    {product.totalQuantity}
                  </p>
                  <p className="text-xs text-[#6B7280]">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {product.availableQuantity}
                  </p>
                  <p className="text-xs text-[#6B7280]">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {product.checkedOutQuantity}
                  </p>
                  <p className="text-xs text-[#6B7280]">Checked Out</p>
                </div>
              </div>

              {/* Transaction Stats */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#374151]">
                  Transaction History
                </h4>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#800020]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-blue-600">
                        {stats.totalCheckOuts}
                      </p>
                      <p className="text-xs text-blue-600">Total Check-outs</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-green-600">
                        {stats.totalCheckIns}
                      </p>
                      <p className="text-xs text-green-600">Total Check-ins</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-orange-600">
                        {stats.openCheckOuts}
                      </p>
                      <p className="text-xs text-orange-600">Open Check-outs</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 p-6 border-t border-[#E5E7EB]">
            <button
              onClick={() => {
                onCheckOut(product.id);
                onClose();
              }}
              disabled={product.availableQuantity === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>Check Out</span>
            </button>
            <button
              onClick={() => {
                onCheckIn(product.id);
                onClose();
              }}
              disabled={stats.openCheckOuts === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#800020] text-[#800020] rounded-lg hover:bg-[#800020]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Check In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{product.name}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
