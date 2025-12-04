"use client";

import { ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useProductStore } from "@/stores/productStore";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function CategoryDonut() {
  const router = useRouter();
  const { products } = useProductStore();

  // Calculate category distribution from real products
  const data = useMemo(() => {
    const categoryMap = new Map<string, number>();

    products.forEach(product => {
      const category = product.categoryName || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + product.totalQuantity);
    });

    // Convert to array and sort by value
    const categories = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Assign colors
    const colors = ["#8B1538", "#3B82F6", "#10B981", "#F59E0B", "#6B7280", "#EC4899", "#8B5CF6"];

    return categories.map((cat, index) => ({
      ...cat,
      color: colors[index % colors.length]
    }));
  }, [products]);

  const handleViewAll = () => {
    router.push('/dashboard/categories');
  };

  // Show message if no data
  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Stock by Category</h3>
        </div>
        <div className="flex items-center justify-center h-60 text-gray-500">
          No products available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Stock by Category</h3>
        <button
          onClick={handleViewAll}
          className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="w-60 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-8 flex gap-1 items-center justify-center flex-wrap text-sm text-gray-600">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-[25px] h-3" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}