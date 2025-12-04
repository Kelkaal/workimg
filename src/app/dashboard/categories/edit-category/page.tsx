"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Wrench,
  HardHat,
  Box,
  Zap,
  Briefcase,
  Settings,
  Hammer,
  MessageSquare,
  Ruler,
  Package,
  Truck,
  Warehouse,
  Shield,
  Plug,
  Target,
  Paintbrush,
  Cog,
  Edit,
  Bell,
  Plus,
  // Trash2,
} from "lucide-react";
import PageHeader from "@/components/dashboard/DashboardHeader";
import { useCategories } from "@/contexts/CategoryContext";

const icons = [
  { id: "wrench", Icon: Wrench },
  { id: "hardhat", Icon: HardHat },
  { id: "box", Icon: Box },
  { id: "zap", Icon: Zap },
  { id: "briefcase", Icon: Briefcase },
  { id: "settings", Icon: Settings },
  { id: "hammer", Icon: Hammer },
  { id: "message", Icon: MessageSquare },
  { id: "ruler", Icon: Ruler },
  { id: "toolbox", Icon: Package },
  { id: "truck", Icon: Truck },
  { id: "warehouse", Icon: Warehouse },
  { id: "shield", Icon: Shield },
  { id: "plug", Icon: Plug },
  { id: "target", Icon: Target },
  { id: "paintbrush", Icon: Paintbrush },
  { id: "cog", Icon: Cog },
  { id: "edit", Icon: Edit },
];

const colors = [
  {
    id: "blue",
    value: "#3B82F6",
    gradientClass: "from-[#2563EB] to-[#38BDF8]",
  },
  {
    id: "green",
    value: "#10B981",
    gradientClass: "from-[#16A34A] to-[#22C55E]",
  },
  {
    id: "purple",
    value: "#A855F7",
    gradientClass: "from-[#8B5CF6] to-[#A855F7]",
  },
  {
    id: "orange",
    value: "#F97316",
    gradientClass: "from-[#F97316] to-[#FB923C]",
  },
  { id: "red", value: "#EF4444", gradientClass: "from-[#B1002F] to-[#E11D48]" },
  {
    id: "yellow",
    value: "#EAB308",
    gradientClass: "from-[#D97706] to-[#FACC15]",
  },
  {
    id: "pink",
    value: "#EC4899",
    gradientClass: "from-[#EC4899] to-[#F472B6]",
  },
  {
    id: "indigo",
    value: "#6366F1",
    gradientClass: "from-[#6366F1] to-[#818CF8]",
  },
  {
    id: "teal",
    value: "#14B8A6",
    gradientClass: "from-[#14B8A6] to-[#2DD4BF]",
  },
  {
    id: "cyan",
    value: "#06B6D4",
    gradientClass: "from-[#06B6D4] to-[#22D3EE]",
  },
  {
    id: "lime",
    value: "#84CC16",
    gradientClass: "from-[#84CC16] to-[#A3E635]",
  },
  {
    id: "amber",
    value: "#F59E0B",
    gradientClass: "from-[#F59E0B] to-[#FCD34D]",
  },
];

// Renamed component to avoid conflict
function EditCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("id");

  const { updateCategory, deleteCategory, categories } = useCategories();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("briefcase");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const SelectedIconComponent =
    icons.find((icon) => icon.id === selectedIcon)?.Icon || Briefcase;

  const selectedColorData = colors.find((c) => c.value === selectedColor);

  useEffect(() => {
    if (!categoryId || !categories.length) return;

    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setCategoryName(category.name);
      setDescription(category.description);
      setSelectedIcon(category.iconId);
      setSelectedColor(category.colorValue);
    }
  }, [categoryId, categories]);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCategory(categoryId!, {
        name: categoryName.trim(),
        description: description.trim(),
        iconId: selectedIcon,
        bgClass:
          selectedColorData?.gradientClass || "from-[#3B82F6] to-[#60A5FA]",
        colorValue: selectedColor,
      });
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Update category failed", err);
      alert("Failed to update category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryId!);
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Delete category failed", err);
      alert("Failed to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section>
      {/* Header */}
      <PageHeader
        title="Edit Category"
        subtitle="Update category details"
        rightContent={
          <>
            <button className="relative w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button className="flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </>
        }
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Tools & Equipment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Choose a clear, descriptive name for this category
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what items belong in this category..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Optional but helps staff understand what items belong in this
                  category
                </p>
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Visual Settings
            </h2>

            <div className="space-y-6">
              {/* Category Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category Icon
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                  {icons.map(({ id, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedIcon(id)}
                      className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 transition-all hover:border-gray-400 ${
                        selectedIcon === id
                          ? "border-[#800020] bg-[#800020]20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          selectedIcon === id
                            ? "text-[#800020]"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Select an icon to visually represent this category
                </p>
              </div>

              {/* Category Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category Color
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                  {colors.map(({ id, value }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedColor(value)}
                      className={`w-full aspect-square rounded-xl transition-all ${
                        selectedColor === value
                          ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: value }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Choose a color for quick visual identification
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preview</h2>

            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <SelectedIconComponent
                      className="w-6 h-6"
                      style={{ color: selectedColor }}
                    />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {categoryName || "Category Name"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {description || "Category description will appear here"}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 items</span>
                  <span className="text-gray-400">Just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="px-6 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Category"}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-medium text-white bg-[#8B1538] rounded-xl hover:bg-[#731229] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isSubmitting ? "Updating..." : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main page component with proper Suspense wrapper
export default function EditCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCategoryContent />
    </Suspense>
  );
}

