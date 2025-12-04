"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Info, Camera, Upload, X, ChevronRight } from "lucide-react";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { toast } from "sonner";
import Image from "next/image";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useProductStore } from "@/stores/productStore";
import { requireOrganizationId } from "@/lib/orgUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { updateProduct } = useProductStore();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "",
    quantity: "0", // Read-only for edit usually, or handled via transactions? API allows update?
    // UpdateProductRequest allows name, description, categoryId, lowStockThreshold, photoUrl, status.
    // Quantity is usually managed via restock/consume/check-in/out.
    // But for "Edit", maybe we just show it or allow correction?
    // The API UpdateProductRequest does NOT have quantity.
    description: "",
    lowStockThreshold: "10",
    unitOfMeasurement: "Pieces",
    storageLocation: "",
    photo: null as File | null,
    photoUrl: "",
    internalNotes: "",
  });

  // Fetch categories and product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgId = requireOrganizationId();
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        // Fetch Categories
        const catResponse = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${orgId}/categories?page=0&size=20`,
          {
            method: "GET",
            headers: {
              // 'x-organization-id': orgId,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (catResponse.ok) {
          const catResult = await catResponse.json();
          setCategories(catResult.data.content || []);
        }
        setLoadingCategories(false);

        // Fetch Product
        const prodResponse = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${productId}`,
          {
            method: "GET",
            headers: {
              // 'x-organization-id': orgId,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!prodResponse.ok) {
          throw new Error("Failed to fetch product");
        }

        const prodResult = await prodResponse.json();
        const product = prodResult.data;

        setFormData({
          itemName: product.name,
          categoryId: product.categoryId,
          quantity: product.totalQuantity.toString(),
          description: product.description || "",
          lowStockThreshold: product.lowStockThreshold?.toString() || "10",
          unitOfMeasurement: "Pieces", // Not in API response yet, using default
          storageLocation: "", // Not in API response yet
          photo: null,
          photoUrl: product.photoUrl || "",
          internalNotes: "", // Not in API response yet
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product details");
        router.push("/dashboard/products");
      } finally {
        setFetching(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, router]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.itemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

      let photoUrl = formData.photoUrl; // Default to existing URL

      // If a new file is selected, upload it
      if (formData.photo) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.photo);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();
        photoUrl = uploadResult.url; // ← CLOUDINARY URL HERE
      }

      const success = await updateProduct(productId, {
        name: formData.itemName,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || undefined,
        photoUrl: photoUrl || undefined,
      });

      if (success) {
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/products");
  };

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData(prev => ({ ...prev, photo: file }));
  //   }
  // };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020]"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        {/* Header with Breadcrumb */}
        <DashboardHeader
          title="Edit Item"
          subtitle={
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span>Products</span>
              <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
              <span>Edit Item</span>
            </div>
          }
          rightContent={<NotificationBell />}
        />

        <div className="px-4 sm:px-6 pt-6 pb-6">
          {/* Centered Form Container */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border border-[#E5E7EB] shadow-sm p-6 space-y-6 bg-white">
                <div className="flex items-center gap-2">
                  <Info
                    className="w-[18px] h-[18px] text-[#800020]"
                    strokeWidth={2.5}
                  />
                  <h2 className="text-lg font-bold text-[#111827] leading-7">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Name */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          itemName: e.target.value,
                        }))
                      }
                      placeholder="Enter item name"
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.categoryId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: e.target.value,
                          }))
                        }
                        disabled={loadingCategories}
                        className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] appearance-none focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingCategories
                            ? "Loading categories..."
                            : "Select a category"}
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
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

                  {/* Quantity (Read Only) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Current Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-lg text-base text-[#6B7280] cursor-not-allowed"
                    />
                    <p className="text-xs text-[#6B7280]">
                      Quantity is managed via transactions
                    </p>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Enter item description"
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Management */}
              <div className="rounded-xl border border-[#E5E7EB] shadow-sm p-6 space-y-6 bg-white">
                <div className="flex items-center gap-2">
                  <svg
                    width="22"
                    height="18"
                    viewBox="0 0 22 18"
                    fill="none"
                    className="text-[#800020]"
                  >
                    <path
                      d="M3 1H19C20.1046 1 21 1.89543 21 3V15C21 16.1046 20.1046 17 19 17H3C1.89543 17 1 16.1046 1 15V3C1 1.89543 1.89543 1 3 1Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 7H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-[#111827] leading-7">
                    Stock Management
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Low Stock Alert Threshold */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Low Stock Alert Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lowStockThreshold: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                    />
                  </div>

                  {/* Unit of Measurement */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Unit of Measurement
                    </label>
                    <div className="relative">
                      <select
                        value={formData.unitOfMeasurement}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            unitOfMeasurement: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] appearance-none focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent cursor-pointer"
                      >
                        <option value="Pieces">Pieces</option>
                        <option value="Units">Units</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Packs">Packs</option>
                        <option value="Kg">Kg</option>
                        <option value="Liters">Liters</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
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
                </div>
              </div>

              {/* Item Photo */}
              <div className="rounded-xl border border-[#E5E7EB] shadow-sm p-6 space-y-6 bg-white">
                <div className="flex items-center gap-2">
                  <Camera
                    className="w-[18px] h-[18px] text-[#800020]"
                    strokeWidth={2.5}
                  />
                  <h2 className="text-lg font-bold text-[#111827] leading-7">
                    Item Photo
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Display Area */}
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[#E5E7EB] cursor-pointer">
                    {formData.photoUrl ? (
                      <Image
                        src={formData.photoUrl}
                        alt="Current Photo"
                        fill
                        className="object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center text-[#6B7280]">
                        <Upload
                          className="w-6 h-6 text-[#9CA3AF] mb-2"
                          strokeWidth={2}
                        />
                        <p className="text-sm font-medium text-[#111827] mb-1">
                          No image available
                        </p>
                        <p className="text-xs">Photo URL not set</p>
                      </div>
                    )}
                    {/* Overlay for click (optional) */}
                    {formData.photoUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">
                          Click to change
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[#E5E7EB] pt-6 flex items-center justify-between">
                <button
                  onClick={handleCancel}
                  className="px-4 py-3 border border-[#D1D5DB] bg-white text-[#374151] text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Cancel</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-[#800020] text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#6a0019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
