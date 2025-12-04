"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Package,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  Wrench,
  HardHat,
  Box,
  Zap,
  Briefcase,
  Settings,
  Hammer,
  MessageSquare,
  Ruler,
  Truck,
  Warehouse,
  Shield,
  Plug,
  Target,
  Paintbrush,
  Cog,
  Edit,
} from "lucide-react";
import { useCategories } from "@/contexts/CategoryContext";
import { useProductStore } from "@/stores/productStore";
import PageHeader from "@/components/dashboard/DashboardHeader";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { toast } from "sonner";

// Map your iconId strings to actual Lucide components
const iconComponents: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  wrench: Wrench,
  hardhat: HardHat,
  box: Box,
  zap: Zap,
  briefcase: Briefcase,
  settings: Settings,
  hammer: Hammer,
  message: MessageSquare,
  ruler: Ruler,
  toolbox: Package,
  truck: Truck,
  warehouse: Warehouse,
  shield: Shield,
  plug: Plug,
  target: Target,
  paintbrush: Paintbrush,
  cog: Cog,
  edit: Edit,
};

export default function CategoriesGridPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const router = useRouter();
  const { categories, deleteCategory } = useCategories();
  const { products, fetchProducts } = useProductStore();

  // Fetch products on mount to calculate category counts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate product counts per category
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      if (product.categoryId) {
        counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Merge categories with actual product counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      products: productCountByCategory[cat.id] || 0,
    }));
  }, [categories, productCountByCategory]);

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    setDeleteModal({ id: categoryId, name: categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;

    setIsDeleting(deleteModal.id);
    try {
      await deleteCategory(deleteModal.id);
      toast.success("Category deleted successfully");
      setDeleteModal(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  console.log("Categories with counts:", categoriesWithCounts);

  const totalCategories = categoriesWithCounts.length;
  const totalProducts = categoriesWithCounts.reduce(
    (sum, cat) => sum + cat.products,
    0
  );
  const activeCategories = categoriesWithCounts.filter(
    (cat) => cat.products > 0
  ).length;
  const emptyCategories = categoriesWithCounts.filter(
    (cat) => cat.products === 0
  ).length;

  const filteredCategories = categoriesWithCounts.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      {/* Header */}
      <PageHeader
        title="Categories"
        subtitle="Manage your product categories and organize inventory"
        rightContent={
          <>
            <NotificationBell />

            <button
              className="flex items-center gap-2 bg-[#800020] text-white px-2 sm:px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() =>
                router.push("/dashboard/categories/create-category")
              }
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Category</span>
            </button>
          </>
        }
      />

      <div className="min-h-screen bg-white p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Dynamic Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-pink-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Categories</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalCategories}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalProducts}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Active Categories</p>
              <p className="text-3xl font-bold text-gray-900">
                {activeCategories}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Empty Categories</p>
              <p className="text-3xl font-bold text-gray-900">
                {emptyCategories}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const Icon = iconComponents[category.iconId] || Briefcase;

              return (
                <div
                  key={category.id ?? category.name}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Gradient Header with Selected Icon */}
                  <div
                    className={`bg-linear-to-br ${category.bgClass} h-44 flex items-center justify-center text-white`}
                  >
                    <Icon className="w-20 h-20" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {category.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          category.products > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {category.products > 0 ? "Active" : "Empty"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-5">
                      {category.description || "No description provided"}
                    </p>

                    <div className="flex items-center justify-between text-sm mb-5">
                      <span className="flex items-center gap-2 text-gray-700 font-medium">
                        <Package className="w-4 h-4 text-gray-500" />
                        {category.products} Products
                      </span>
                      <span className="text-gray-500">
                        {totalProducts > 0
                          ? `${Math.round(
                              (category.products / totalProducts) * 100
                            )}% of total`
                          : "0% of total"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/categories/edit-category?id=${category.id}`
                          )
                        }
                        className="w-11 h-11 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(category.id, category.name)
                        }
                        disabled={isDeleting === category.id}
                        className="w-11 h-11 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        {isDeleting === category.id ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No categories found</p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search or create a new category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDeleteModal(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Category
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  &quot;{deleteModal.name}&quot;
                </span>
                ? All products in this category will need to be reassigned.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={isDeleting === deleteModal.id}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting === deleteModal.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting === deleteModal.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
