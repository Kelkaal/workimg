"use client";

import { useEffect } from "react";
import { useProductStore } from "@/stores/productStore";
import StatCard from "@/components/dashboard/StatCard";
import StockLevelsChart from "@/components/dashboard/Charts/StockLevelsChart";
import CategoryDonut from "@/components/dashboard/Charts/CategoryDonut";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import ProductsTable from "@/components/dashboard/RecentProductsTable";
import { PackageOpen, AlertTriangle, DollarSign, Tags } from "lucide-react";

export default function DashboardShell() {
	const { fetchProducts, getStats } = useProductStore();
	const stats = getStats();

	// Fetch products on mount
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	// Calculate deltas based on current stats
	const totalDelta = stats.total > 0 ? "+12%" : "0%";
	const lowStockDelta = stats.lowStock > 0 ? "-8%" : "0%";
	const inStockDelta = stats.inStock > 0 ? "+15%" : "0%";
	const outOfStockDelta = stats.outOfStock > 0 ? "+5" : "0";


	return (
		<div className="w-full bg-[#F8F9FB]">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">

				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					<StatCard
						title="Total Products"
						value={stats.total.toString()}
						delta={totalDelta}
						deltaType="increase"
						icon={PackageOpen}
						iconColor="text-blue-600"
						iconBg="bg-blue-50"
					/>
					<StatCard
						title="Low Stock Items"
						value={stats.lowStock.toString()}
						delta={lowStockDelta}
						deltaType="decrease"
						icon={AlertTriangle}
						iconColor="text-red-600"
						iconBg="bg-red-50"
					/>
					<StatCard
						title="In Stock"
						value={stats.inStock.toString()}
						delta={inStockDelta}
						deltaType="increase"
						icon={DollarSign}
						iconColor="text-green-600"
						iconBg="bg-green-50"
					/>
					<StatCard
						title="Out of Stock"
						value={stats.outOfStock.toString()}
						delta={outOfStockDelta}
						deltaType="increase"
						deltaColor="text-purple-600 bg-purple-50"
						icon={Tags}
						iconColor="text-purple-600"
						iconBg="bg-purple-50"
					/>
				</div>

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
					<StockLevelsChart />
					<CategoryDonut />
				</div>

				{/* Alert */}
				<LowStockAlert />

				{/* Table */}
				<ProductsTable />
			</div>
		</div>
	);
}