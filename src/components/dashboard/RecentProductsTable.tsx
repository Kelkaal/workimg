"use client";

import { Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useProductStore } from "@/stores/productStore";
import ProductTable from "@/components/dashboard/products/ProductTable";
import Pagination from "@/components/dashboard/products/Pagination";

export default function RecentProductsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { products } = useProductStore();

  // Local filtering logic (independent from products page)
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 border-b border-[#E5E7EB]">
        <h3 className="text-xl font-semibold text-gray-900">Recent Products</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition">
            <Filter className="text-gray-400 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        showCheckbox={false}
        showHeader={true}
        products={paginatedProducts}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
