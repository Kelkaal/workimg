"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import StatusBadge from "./StatusBadge";
import { formatStockQuantity } from "@/lib/mockProductData";
import type { Product } from "@/types/product";

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
  showCheckbox?: boolean;
  onCheckInClick?: (productId: string) => void;
  onCheckOutClick?: (productId: string) => void;
  onProductClick?: (product: Product) => void;
  products?: Product[];
}

function ProductRow({
  product,
  isSelected,
  onToggleSelect,
  onCheckIn,
  onCheckOut,
  showCheckbox = true,
  onCheckInClick,
  onCheckOutClick,
  onProductClick,
}: ProductRowProps) {
  return (
    <tr className="border-t border-[#E5E7EB]">
      {showCheckbox && (
        <td className="px-3 sm:px-6 py-3 sm:py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded border-[#767676] text-[#800020] focus:ring-[#800020] cursor-pointer"
          />
        </td>
      )}
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <div
          onClick={() => onProductClick?.(product)}
          className="flex cursor-pointer items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity"
        >
          <Image
            src={
              product.photoUrl?.startsWith("http")
                ? product.photoUrl
                : "/placeholder-product.png"
            }
            alt={product.name}
            width={48}
            height={48}
            className="rounded-lg object-cover flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold text-[#111827] leading-5 truncate max-w-[100px] sm:max-w-none">
              {product.name}
            </span>
            <span className="text-xs text-[#6B7280] leading-4 truncate max-w-[100px] sm:max-w-none hidden sm:block">
              {product.description}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
        <span className="text-sm font-medium text-[#111827] leading-5">
          {product.sku}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
        <span className="text-sm text-[#4B5563] leading-5">
          {product.category}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <span
          className={`text-xs sm:text-sm font-semibold leading-5 ${product.status === "Low Stock" ? "text-[#DC2626]" : "text-[#111827]"
            }`}
        >
          {formatStockQuantity(product.stock)}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onCheckOutClick ? onCheckOutClick(product.id) : onCheckOut()
            }
            className="px-1.5 sm:px-2 py-1.5 bg-[#800020] text-white text-xs font-bold rounded-md flex items-center gap-0.5 hover:bg-[#6a0019] cursor-pointer transition-colors"
          >
            <span className="leading-none hidden sm:inline">Out</span>
            <ArrowRight className="w-2.5 h-2.5" strokeWidth={3} />
          </button>
          <button
            onClick={() =>
              onCheckInClick ? onCheckInClick(product.id) : onCheckIn()
            }
            className="px-1.5 sm:px-2 py-1.5 bg-white border border-[#D1D5DB] text-[#374151] text-xs font-bold rounded-md flex items-center gap-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-2.5 h-2.5" strokeWidth={3} />
            <span className="leading-none hidden sm:inline">In</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

interface ProductTableProps {
  showCheckbox?: boolean;
  showHeader?: boolean;
  onCheckInClick?: (productId: string) => void;
  onCheckOutClick?: (productId: string) => void;
  onProductClick?: (product: Product) => void;
  products?: Product[];
}

export default function ProductTable({
  showCheckbox = true,
  showHeader = false,
  onCheckInClick,
  onCheckOutClick,
  onProductClick,
  products: customProducts,
}: ProductTableProps) {
  // Subscribe to store
  // Subscribe to store
  // const products = useProductStore((state) => state.products);
  // const filters = useProductStore((state) => state.filters);
  // const pagination = useProductStore((state) => state.pagination);
  const getPaginatedProducts = useProductStore((state) => state.getPaginatedProducts);
  const selectedProducts = useProductStore((state) => state.selectedProducts);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const toggleProductSelection = useProductStore(
    (state) => state.toggleProductSelection
  );
  const toggleAllSelection = useProductStore(
    (state) => state.toggleAllSelection
  );
  const checkInProduct = useProductStore((state) => state.checkInProduct);
  const checkOutProduct = useProductStore((state) => state.checkOutProduct);
  const getLastTransaction = useProductStore(
    (state) => state.getLastTransaction
  );

  // Fetch products on mount
  // console.log('Current Products in Store:', products);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = customProducts || getPaginatedProducts();
  const allSelected =
    showCheckbox &&
    displayProducts.length > 0 &&
    displayProducts.every((p: Product) => selectedProducts.includes(p.id));

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="bg-white rounded-t-lg border border-[#E5E7EB] shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-lg font-medium text-gray-900">No products found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  const handleCheckIn = async (productId: string) => {
    const lastTx = await getLastTransaction(productId, "CHECK_OUT");
    if (!lastTx)
      return toast.error("No checkout transaction found for this product.");

    checkInProduct(productId, {
      checkOutTransactionId: lastTx.id,
      quantity: 1,
      condition: "GOOD",
    });
  };

  const handleCheckOut = async (productId: string) => {
    // Get the current user ID from storage
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please sign in again.");
      return;
    }
    checkOutProduct(productId, {
      userId,
      quantity: 1,
      purpose: "Assigned from Dashboard",
    });
  };

  return (
    <div
      className={`bg-white ${showHeader ? "" : "rounded-t-lg border-b-0"
        } border border-[#E5E7EB] shadow-sm overflow-x-auto`}
    >
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-[#E5E7EB]">
            {showCheckbox && (
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAllSelection}
                  className="w-4 h-4 rounded border-[#767676] text-[#800020] focus:ring-[#800020] cursor-pointer"
                />
              </th>
            )}
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4">
              Product
            </th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4 hidden md:table-cell">
              SKU
            </th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4 hidden lg:table-cell">
              Category
            </th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4">
              Stock
            </th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4">
              Status
            </th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wide leading-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {displayProducts.map((product: Product) => (
            <ProductRow
              key={product.id}
              product={product}
              isSelected={selectedProducts.includes(product.id)}
              onToggleSelect={() => toggleProductSelection(product.id)}
              onCheckIn={() => handleCheckIn(product.id)}
              onCheckOut={() => handleCheckOut(product.id)}
              showCheckbox={showCheckbox}
              onCheckInClick={onCheckInClick}
              onCheckOutClick={onCheckOutClick}
              onProductClick={onProductClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
