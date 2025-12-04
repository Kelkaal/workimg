"use client";

import { TrendingUp, ThumbsUp, CheckCircle } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useCategories } from "@/contexts/CategoryContext";
import { useEffect, useMemo } from "react";

export default function StatsCards() {
  const { products, fetchProducts } = useProductStore();
  const { categories } = useCategories();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate real stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;

    // Count checked out items
    const checkedOutCount = products.reduce(
      (sum, p) => sum + (p.checkedOutQuantity || 0),
      0
    );

    // Total items managed (sum of all quantities)
    const totalItemsManaged = products.reduce(
      (sum, p) => sum + (p.totalQuantity || 0),
      0
    );

    return {
      totalProducts,
      totalCategories,
      checkedOutCount,
      totalItemsManaged,
    };
  }, [products, categories]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Card 1 - Total Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
          </div>
          <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-pink-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Across {stats.totalCategories} categories
        </p>
      </div>

      {/* Card 2 - Items Managed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Items Managed</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalItemsManaged}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <ThumbsUp className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500">Total inventory quantity</p>
      </div>

      {/* Card 3 - Check-Outs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Checked Out</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.checkedOutCount}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500">Items currently checked out</p>
      </div>
    </div>
  );
}
