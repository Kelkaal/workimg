"use client";

import { useProductStore } from "@/stores/productStore";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage: customCurrentPage,
  totalPages: customTotalPages,
  totalItems: customTotalItems,
  itemsPerPage: customItemsPerPage,
  onPageChange: customOnPageChange,
}: PaginationProps = {}) {
  const { pagination, setPage, getTotalItems } = useProductStore();

  // Use custom props if provided (dashboard), otherwise use store (products page)
  const currentPage = customCurrentPage ?? pagination.currentPage;
  const itemsPerPage = customItemsPerPage ?? pagination.itemsPerPage;
  const totalItems = customTotalItems ?? getTotalItems();
  const handlePageChange = customOnPageChange ?? setPage;

  const totalPages = customTotalPages ?? Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white rounded-b-lg border border-t border-[#E5E7EB] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side - showing info */}
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#4B5563]">
        <span>Showing</span>
        <span className="text-[#0F172A] font-normal">
          {Math.min(
            itemsPerPage,
            totalItems - (currentPage - 1) * itemsPerPage
          )}
        </span>
        <span>of {totalItems.toLocaleString()} products</span>
      </div>

      {/* Right side - pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || totalPages === 0}
          className="h-9 px-3 sm:px-4 border border-[#D1D5DB] rounded-lg text-sm text-[#0F172A] font-medium flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Page numbers - hidden on mobile, show current/total instead */}
        <div className="hidden sm:flex items-center gap-2">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-base text-[#6B7280]"
                >
                  {page}
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-8 h-9 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#800020] text-white"
                    : "text-[#0F172A] hover:bg-gray-50"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile: Show current/total */}
        <span className="sm:hidden text-sm text-gray-600">
          {currentPage} / {totalPages || 1}
        </span>

        {/* Next button */}
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage >= totalPages || totalPages === 0}
          className="h-9 px-3 sm:px-4 border border-[#D1D5DB] rounded-lg text-sm text-[#0F172A] font-medium flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
