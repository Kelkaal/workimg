'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { requireOrganizationId } from '@/lib/orgUtils';

const statuses = ['All Status', 'In Stock', 'Low Stock', 'Out of Stock'];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Category {
  id: string;
  name: string;
}

export default function ProductFilters() {
  const { filters, setSearch, setCategory, setStatus } = useProductStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const orgId = requireOrganizationId();
        const response = await fetch(`${API_BASE_URL}/api/v1/organizations/${orgId}/categories?page=0&size=20`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setCategories(result.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 bg-[#FFF] p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Search Input */}
      <div className="relative w-full lg:flex-[2]">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 text-base text-[#9CA3AF] placeholder:text-[#9CA3AF] bg-[#F3F4F6]/30 border-0 rounded-lg focus:outline-none ring-2 focus:ring-gray-300 ring-gray-200"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
      </div>

      {/* Filters Wrapper */}
      <div className="flex gap-4 w-full lg:flex-1">
        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => setCategory(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          disabled={loading}
          className="h-11 flex-1 px-4 text-base text-[#0F172A] bg-[#F3F4F6] border-0 rounded-lg focus:outline-none ring-2 focus:ring-gray-300 ring-gray-200 cursor-pointer appearance-none disabled:opacity-50 min-w-0"
        >
          <option value="All Categories">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 flex-1 px-4 text-base text-[#0F172A] bg-[#F3F4F6] border-0 rounded-lg focus:outline-none ring-2 focus:ring-gray-300 ring-gray-200 cursor-pointer appearance-none min-w-0"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}