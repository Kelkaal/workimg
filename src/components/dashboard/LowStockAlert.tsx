"use client";

import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/productStore";

export default function LowStockAlert() {
	const router = useRouter();
	const { getStats } = useProductStore();
	const stats = getStats();

	const handleViewItems = () => {
		// Navigate to products page with low stock filter
		router.push('/dashboard/products?filter=lowStock');
	};

	// Only show alert if there are low stock items
	if (stats.lowStock === 0) {
		return null;
	}

	return (
		<div className="bg-red-50 border border-red-200 rounded-2xl p-2 shadow-sm mb-8 flex sm:flex-row items-center sm:items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<span className="p-2 bg-red-500/20 rounded-xl">
					<i className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xl font-bold">
						!
					</i>
				</span>
				<div>
					<h4 className="font-bold sm:text-lg text-red-900">Low Stock Alert</h4>
					<p className="text-red-700 text-sm sm:text-base">
						{stats.lowStock} {stats.lowStock === 1 ? 'product is' : 'products are'} running low on stock and need restocking.
					</p>
				</div>
			</div>
			<button
				onClick={handleViewItems}
				className="bg-[#800020] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#6b001a] transition"
			>
				View Items
			</button>
		</div>
	);
}