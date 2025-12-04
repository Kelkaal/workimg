/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info, Camera, Upload, X, ChevronRight } from "lucide-react";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useProductStore } from "@/stores/productStore";
// organizationId is now fetched from sessionStorage/localStorage directly
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Shelf {
  id: string;
  name: string;
  description?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingShelves, setLoadingShelves] = useState(true);
  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "",
    shelfId: "",
    initialQuantity: "0",
    description: "",
    lowStockThreshold: "10",
    unitOfMeasurement: "Pieces",
    storageLocation: "",
    photos: [] as File[],
    photoUrls: [] as string[],
    internalNotes: "",
  });

  // Add Category Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Add Shelf Modal state
  const [showAddShelfModal, setShowAddShelfModal] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [newShelfDescription, setNewShelfDescription] = useState("");
  const [creatingShelf, setCreatingShelf] = useState(false);

  const fetchCategories = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return;
      }

      if (!orgId) {
        toast.error(
          "No organization found. Please select an organization first."
        );
        return;
      }

      setLoadingCategories(true);
      console.log("Fetching categories for org:", orgId);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/categories?page=0&size=20`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Categories response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No categories found");
          setCategories([]);
          return;
        }
        throw new Error("Failed to fetch categories");
      }

      const result = await response.json();
      console.log("Categories result:", result);
      setCategories(result.data?.content || result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch shelves from localStorage (mock)
  const fetchShelves = async () => {
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      if (!orgId) return;

      setLoadingShelves(true);

      // Get shelves from localStorage (mock storage)
      const key = `mock_shelves_${orgId}`;
      const data = localStorage.getItem(key);
      const shelvesList: Shelf[] = data ? JSON.parse(data) : [];
      setShelves(shelvesList);

      // Auto-select the first shelf if available
      if (shelvesList.length > 0) {
        const defaultShelf =
          shelvesList.find((s: Shelf) => s.name === "Default Shelf") ||
          shelvesList[0];
        if (defaultShelf) {
          setFormData((prev) => ({ ...prev, shelfId: defaultShelf.id }));
        }
      }
    } catch (error) {
      console.error("Error fetching shelves:", error);
    } finally {
      setLoadingShelves(false);
    }
  };

  // Fetch categories and shelves on mount
  useEffect(() => {
    fetchCategories();
    fetchShelves();
  }, []);

  // Create new category inline
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setCreatingCategory(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/categories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.data) {
        toast.success("Category created successfully!");
        // Add new category to list and select it
        setCategories((prev) => [...prev, result.data]);
        setFormData((prev) => ({ ...prev, categoryId: result.data.id }));
        setShowAddCategoryModal(false);
        setNewCategoryName("");
        setNewCategoryDescription("");
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Create new shelf inline (using localStorage mock)
  const handleCreateShelf = async () => {
    if (!newShelfName.trim()) {
      toast.error("Shelf name is required");
      return;
    }

    setCreatingShelf(true);
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      // Create shelf in localStorage (mock)
      const newShelf: Shelf = {
        id: crypto.randomUUID(),
        name: newShelfName.trim(),
        description: newShelfDescription.trim() || undefined,
      };

      // Get existing shelves and add new one
      const key = `mock_shelves_${orgId}`;
      const existingShelves = JSON.parse(localStorage.getItem(key) || "[]");
      existingShelves.push(newShelf);
      localStorage.setItem(key, JSON.stringify(existingShelves));

      toast.success("Shelf created successfully!");
      // Add new shelf to list and select it
      setShelves((prev) => [...prev, newShelf]);
      setFormData((prev) => ({ ...prev, shelfId: newShelf.id }));
      setShowAddShelfModal(false);
      setNewShelfName("");
      setNewShelfDescription("");
    } catch (error) {
      console.error("Error creating shelf:", error);
      toast.error("Failed to create shelf");
    } finally {
      setCreatingShelf(false);
    }
  };

  const handleSubmit = async (_saveAsDraft = false) => {
    // Validate required fields
    if (!formData.itemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const quantity = parseInt(formData.initialQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);

      // Use the first photo URL if available
      const photoUrl = formData.photoUrls.length > 0 ? formData.photoUrls[0] : undefined;

      const success = await createProduct({
        name: formData.itemName,
        description: formData.description || undefined,
        quantity,
        categoryId: formData.categoryId,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || undefined,
        photoUrl,
      });

      if (success) {
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/products");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Validate types
    const validFiles = newFiles.filter(file =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );

    if (validFiles.length !== newFiles.length) {
      toast.error("Only PNG, JPG or JPEG files are allowed");
    }

    if (validFiles.length === 0) return;

    // Validate max files (total 5)
    if (formData.photos.length + validFiles.length > 5) {
      toast.error("You can only have up to 5 photos");
      return;
    }

    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...validFiles] }));

    try {
      const uploadFormData = new FormData();
      validFiles.forEach(file => uploadFormData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (result?.urls) {
        setFormData((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, ...result.urls] }));
        toast.success("Photos uploaded successfully");
      } else {
        toast.error("Failed to get photo URLs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading photos");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoUrls: prev.photoUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        {/* Header with Breadcrumb */}
        <DashboardHeader
          title="Add New Item"
          subtitle={
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span>Products</span>
              <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
              <span>Add New Item</span>
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
                    <p className="text-xs text-[#6B7280]">
                      Provide a clear, descriptive name for the item
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Category *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
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
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryModal(true)}
                        className="px-3 py-3 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors flex items-center gap-1"
                        title="Add new category"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Low Stock Threshold - moved here */}
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
                    <p className="text-xs text-[#6B7280]">
                      Alert when quantity falls below this number
                    </p>
                  </div>

                  {/* Initial Quantity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Initial Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.initialQuantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          initialQuantity: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                    />
                    <p className="text-xs text-[#6B7280]">
                      Starting quantity in stock
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
                      placeholder="Enter item description, specifications, or notes"
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-[#6B7280]">
                      Optional details about the item
                    </p>
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
                  {/* Shelf Selection - moved above Unit of Measurement */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Shelf
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={formData.shelfId}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              shelfId: e.target.value,
                            }))
                          }
                          disabled={loadingShelves}
                          className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] appearance-none focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent cursor-pointer disabled:opacity-50"
                        >
                          <option value="">
                            {loadingShelves
                              ? "Loading shelves..."
                              : "Select a shelf"}
                          </option>
                          {shelves.map((shelf) => (
                            <option key={shelf.id} value={shelf.id}>
                              {shelf.name}
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
                      <button
                        type="button"
                        onClick={() => setShowAddShelfModal(true)}
                        className="px-3 py-3 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors flex items-center gap-1"
                        title="Add new shelf"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      Select which shelf this item belongs to
                    </p>
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.photoUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] group">
                        <Image
                          src={url}
                          alt={`Item Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}

                    {formData.photoUrls.length < 5 && (
                      <label className="block cursor-pointer aspect-square">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center w-full h-full text-center text-[#6B7280] border-2 border-dashed border-[#E5E7EB] rounded-lg hover:border-[#800020] hover:bg-gray-50 transition-colors">
                          <Upload
                            className="w-6 h-6 text-[#9CA3AF] mb-2"
                            strokeWidth={2}
                          />
                          <span className="text-xs">Add Photo</span>
                        </div>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Upload up to 5 images. The first image will be used as the main product image.
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              {/* <div className="rounded-xl border border-[#E5E7EB] shadow-sm p-6 space-y-6 bg-white">
                <div className="flex items-center gap-2">
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className="text-[#800020]">
                    <path d="M10 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H13C13.5304 17 14.0391 16.7893 14.4142 16.4142C14.7893 16.0391 15 15.5304 15 15V6L10 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 1V6H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="text-lg font-bold text-[#111827] leading-7">Additional Notes</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Internal Notes</label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                    rows={4}
                    placeholder="Add any internal notes, handling instructions, or special requirements"
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-base text-[#0F172A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-[#6B7280]">These notes are for internal use only</p>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="border-t border-[#E5E7EB] pt-6 flex items-center justify-between">
                <button
                  onClick={handleCancel}
                  className="px-4 py-3 border border-[#D1D5DB] bg-white text-[#374151] text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Cancel</span>
                </button>

                <div className="flex items-center gap-0">
                  <button
                    onClick={() => handleSubmit(true)}
                    className="px-4 py-3 border border-[#D1D5DB] bg-white text-[#374151] text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                      className="text-[#374151]"
                    >
                      <path
                        d="M11 13V11.6667C11 10.9594 10.719 10.2811 10.219 9.78105C9.71895 9.28095 9.04058 9 8.33333 9H3.66667C2.95942 9 2.28105 9.28095 1.78105 9.78105C1.28095 10.2811 1 10.9594 1 11.6667V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 6.33333C7.47276 6.33333 8.66667 5.13943 8.66667 3.66667C8.66667 2.19391 7.47276 1 6 1C4.52724 1 3.33333 2.19391 3.33333 3.66667C3.33333 5.13943 4.52724 6.33333 6 6.33333Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Save as Draft</span>
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="ml-4 px-6 py-3 bg-[#800020] text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#6a0019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-black">+</span>
                        <span>Add Item</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-[#2563EB]" strokeWidth={2.5} />
                  <h3 className="text-sm font-medium text-[#1E3A8A]">
                    Quick Tips
                  </h3>
                </div>
                <ul className="space-y-1 text-sm text-[#1E40AF]">
                  <li>• Item Name and Initial Quantity are required fields</li>
                  <li>
                    • Set a low stock threshold to receive alerts when inventory
                    runs low
                  </li>
                  <li>• Adding a photo helps staff quickly identify items</li>
                  <li>• You can edit all details after creating the item</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Category
              </h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                  placeholder="e.g., Electronics, Furniture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                disabled={creatingCategory}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={creatingCategory || !newCategoryName.trim()}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors disabled:opacity-50"
              >
                {creatingCategory ? "Creating..." : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shelf Modal */}
      {showAddShelfModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Shelf
              </h3>
              <button
                onClick={() => setShowAddShelfModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shelf Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                  placeholder="e.g., Shelf A1, Shelf B2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newShelfDescription}
                  onChange={(e) => setNewShelfDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of this shelf location"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddShelfModal(false)}
                disabled={creatingShelf}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShelf}
                disabled={creatingShelf || !newShelfName.trim()}
                className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors disabled:opacity-50"
              >
                {creatingShelf ? "Creating..." : "Create Shelf"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
