"use client";

import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { useInventoryData } from "@/contexts/InventoryDataContext";

// Extend the StockStatus type to include "Medium"
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Medium";

export interface ProductFormData {
  name: string;
  subtitle: string;
  sku: string;
  category: string;
  quantity: number;
  status: StockStatus;
  image: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const { addProduct } = useInventoryData();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    subtitle: "",
    sku: "",
    category: "",
    quantity: 0,
    status: "In Stock",
    image: "📦",
  });

  // Generic form change handler
  const handleChange = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a fully typed new product
    const newProduct = { ...formData, id: uuidv4() };

    addProduct(newProduct);

    // Reset form
    setFormData({
      name: "",
      subtitle: "",
      sku: "",
      category: "",
      quantity: 0,
      status: "In Stock",
      image: "📦",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              required
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.quantity}
              onChange={(e) =>
                handleChange("quantity", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as StockStatus)
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          {/* Emoji/Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji Icon
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="📦"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#800020] text-white rounded-lg text-sm font-medium hover:bg-[#6a0019]"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
