"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useProductStore } from "@/stores/productStore";
import { useMemo } from "react";

export default function StockLevelsChart() {
	const { products } = useProductStore();

	// Calculate total stock for the chart
	const totalStock = useMemo(() => {
		return products.reduce((sum, product) => sum + product.stock, 0);
	}, [products]);

	// Generate data for last 7 days (simulated with current stock)
	const VARIATIONS = [0.02, -0.03, 0.01, -0.04, 0.05, -0.02, 0];

	const data = useMemo(() => {
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

		return days.map((day, index) => {
			const value = Math.round(totalStock * (1 + VARIATIONS[index]));
			return { day, value: Math.max(0, value) };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalStock]);

	const maxValue = Math.max(...data.map(d => d.value), 100);
	const roundedMax = Math.ceil(maxValue / 500) * 500;

	return (
		<div className="rounded-xl border bg-white p-6 shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold text-gray-900">Stock Levels Over Time</h3>
				<span className="text-sm text-gray-500 bg-gray-100 rounded-md px-3 py-1.5">
					Last 7 days
				</span>
			</div>

			{/* Chart Area */}
			<div className="relative h-72">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
					>
						<defs>
							<linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#FEE2E2" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#FEE2E2" stopOpacity={0.4} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="0" stroke="#E5E7EB" vertical={false} />
						<XAxis
							dataKey="day"
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#4B5563', fontSize: 14 }}
							dy={10}
						/>
						<YAxis
							domain={[0, roundedMax]}
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#6B7280', fontSize: 12 }}
							tickFormatter={(value) => value.toLocaleString()}
							dx={-5}
						/>
						<Area
							type="monotone"
							dataKey="value"
							stroke="#881337"
							strokeWidth={3}
							fill="url(#colorStock)"
							dot={{ fill: '#881337', stroke: 'white', strokeWidth: 2, r: 4 }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Legend */}
			<div className="mt-4 flex items-center justify-center gap-2">
				<div className="w-8 h-3 border-2 border-[#881337] bg-white" />
				<span className="text-sm text-gray-600">Available Stock ({totalStock.toLocaleString()})</span>
			</div>
		</div>
	);
}