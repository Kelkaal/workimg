"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Download,
	Plus,
	Package,
	CircleCheck,
	AlertTriangle,
	XCircle,
} from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import StatsCard from "@/components/dashboard/products/StatsCard";
import ProductTable from "@/components/dashboard/products/ProductTable";
import Pagination from "@/components/dashboard/products/Pagination";
import ProductFilters from "@/components/dashboard/products/ProductFilters";
import CheckInAside, {
	type OpenCheckout,
} from "@/components/dashboard/products/CheckInAside";
import CheckOutAside from "@/components/dashboard/products/CheckOutAside";
import ProductDetailModal from "@/components/dashboard/products/ProductDetailModal";
import { formatNumber } from "@/lib/mockProductData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import type {
	CheckInFormData,
	CheckInItemData,
	CheckOutFormData,
	CheckOutItemData,
} from "@/types/checkin";
import type { Product } from "@/types/product";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.staging.soma.emerj.net";

export default function ProductsPage() {
	const router = useRouter();
	const { getStats, products, fetchProducts } = useProductStore();
	const stats = getStats();

	// Check-in state
	const [checkInData, setCheckInData] = useState<CheckInItemData | null>(null);
	const [openCheckouts, setOpenCheckouts] = useState<OpenCheckout[]>([]);

	// Check-out state
	const [checkOutData, setCheckOutData] = useState<CheckOutItemData | null>(
		null
	);

	// Product detail modal state
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	// Fetch users for mapping userId to userName
	const fetchUserName = async (userId: string): Promise<string> => {
		try {
			const orgId =
				sessionStorage.getItem("organizationId") ||
				localStorage.getItem("organizationId");
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			const res = await fetch(
				`${API_BASE_URL}/api/v1/organizations/${orgId}/users`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!res.ok) return "Unknown User";

			const json = await res.json();
			const users = json.data?.content || json.data || [];
			const user = users.find((u: { id: string }) => u.id === userId);
			return user?.fullName || user?.name || "Unknown User";
		} catch {
			return "Unknown User";
		}
	};

	const handleOpenCheckIn = async (productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (!product) return;

		try {
			const orgId =
				sessionStorage.getItem("organizationId") ||
				localStorage.getItem("organizationId");
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			const res = await fetch(
				`${API_BASE_URL}/api/v1/organizations/${orgId}/products/${productId}/transactions?page=0&size=50`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const json = await res.json();
			const transactions = json.data?.content || [];

			// Find all OPEN checkout transactions
			const openCheckoutTransactions = transactions.filter(
				(t: { transactionType: string; checkOutStatus: string }) =>
					t.transactionType === "CHECK_OUT" && t.checkOutStatus === "OPEN"
			);

			if (openCheckoutTransactions.length === 0) {
				toast.error("No open checkout found for this item");
				return;
			}

			// Map transactions to OpenCheckout format with user names
			const checkoutsWithNames: OpenCheckout[] = await Promise.all(
				openCheckoutTransactions.map(
					async (t: {
						id: string;
						quantity: number;
						userId: string;
						createdOn: string;
						reason?: string;
					}) => ({
						id: t.id,
						quantity: t.quantity,
						userId: t.userId,
						userName: await fetchUserName(t.userId),
						createdOn: t.createdOn,
						reason: t.reason,
					})
				)
			);

			setOpenCheckouts(checkoutsWithNames);
			setCheckInData({
				productId: product.id,
				productName: product.name,
				currentPhotos: [product.image],
				checkedOutQuantity: product.checkedOutQuantity,
			});
		} catch (error) {
			console.error("Failed to fetch transactions:", error);
			toast.error("Failed to load checkout information");
		}
	};

	const handleCloseCheckIn = () => {
		setCheckInData(null);
		setOpenCheckouts([]);
	};

	const handleOpenCheckOut = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (product) {
			setCheckOutData({
				productId: product.id,
				productName: product.name,
				availableQuantity: product.availableQuantity,
			});
		}
	};

	const handleCloseCheckOut = () => {
		setCheckOutData(null);
	};

	const handleCheckInSubmit = async (data: CheckInFormData) => {
		if (!data.checkOutTransactionId) {
			toast.error("Please select a checkout transaction to return");
			return;
		}

		try {
			const orgId =
				sessionStorage.getItem("organizationId") ||
				localStorage.getItem("organizationId");
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			const conditionMap: Record<string, string> = {
				Good: "GOOD",
				Fair: "GOOD",
				Poor: "DAMAGED",
				Damaged: "DAMAGED",
			};

			const res = await fetch(
				`${API_BASE_URL}/api/v1/organizations/${orgId}/products/${checkInData?.productId}/check-in`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						checkOutTransactionId: data.checkOutTransactionId,
						quantity: data.quantityReturned,
						condition: conditionMap[data.condition] || "GOOD",
					}),
				}
			);

			const json = await res.json();

			if (!res.ok) {
				throw new Error(json.message || "Check-in failed");
			}

			toast.success("Item checked in successfully");
			fetchProducts();
			handleCloseCheckIn();
		} catch (error) {
			console.error("Check-in error:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to check in, try again."
			);
		}
	};

	const handleCheckOutSubmit = async (data: CheckOutFormData) => {
		if (!data.userId) {
			toast.error("Please select a user for checkout");
			return;
		}

		try {
			const orgId =
				sessionStorage.getItem("organizationId") ||
				localStorage.getItem("organizationId");
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			const res = await fetch(
				`${API_BASE_URL}/api/v1/organizations/${orgId}/products/${checkOutData?.productId}/check-out`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				}
			);

			const json = await res.json();

			if (!res.ok) {
				throw new Error(json.message || "Checkout failed");
			}

			toast.success("Item checked out successfully");
			fetchProducts();
			handleCloseCheckOut();
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to checkout, try again."
			);
		}
	};

	const handleProductClick = (product: Product) => {
		setSelectedProduct(product);
	};

	const handleExport = () => {
		const headers = ["Product", "SKU", "Category", "Quantity", "Status"];
		const rows = products.map((p) => [
			p.name,
			p.sku,
			p.category,
			String(p.stock),
			p.status,
		]);
		const csv = [headers, ...rows]
			.map((r) =>
				r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
			)
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "products_export.csv";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full min-h-screen">
			<div className="max-w-[1440px] mx-auto">
				<DashboardHeader
					title="Products"
					subtitle="Manage your inventory products"
					rightContent={
						<>
							<button
								onClick={handleExport}
								className="h-10 px-2 sm:px-4 border border-[#D1D5DB] bg-white text-[#374151] text-base font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
							>
								<Download className="w-4 h-4" />
								<span className="hidden sm:inline">Export</span>
							</button>
							<button
								onClick={() => router.push("/dashboard/products/add-product")}
								className="h-10 px-2 sm:px-4 bg-[#800020] text-white text-base font-medium rounded-lg flex items-center gap-2 hover:bg-[#6a0019] cursor-pointer transition-colors"
							>
								<Plus className="w-3.5 h-3.5" strokeWidth={3} />
								<span className="hidden sm:inline">Add Product</span>
							</button>
						</>
					}
				/>

				<div className="px-4 sm:px-6 py-6 space-y-8">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						<StatsCard
							title="Total Products"
							value={formatNumber(stats.total)}
							icon={Package}
							iconColor="text-[#2563EB]"
							iconBgColor="bg-[#2563EB]/20"
						/>
						<StatsCard
							title="In Stock"
							value={formatNumber(stats.inStock)}
							icon={CircleCheck}
							iconColor="text-[#16A34A]"
							iconBgColor="bg-[#16A34A]/20"
						/>
						<StatsCard
							title="Low Stock"
							value={formatNumber(stats.lowStock)}
							icon={AlertTriangle}
							iconColor="text-[#DC2626]"
							iconBgColor="bg-[#DC2626]/20"
						/>
						<StatsCard
							title="Out of Stock"
							value={formatNumber(stats.outOfStock)}
							icon={XCircle}
							iconColor="text-[#4B5563]"
							iconBgColor="bg-[#4B5563]/20"
						/>
					</div>

					{/* Filters */}
					<ProductFilters />

					{/* Products Table */}
					<div className="space-y-0">
						<ProductTable
							onCheckInClick={handleOpenCheckIn}
							onCheckOutClick={handleOpenCheckOut}
							onProductClick={handleProductClick}
						/>
						<Pagination />
					</div>
				</div>
			</div>

			{/* Check In Aside */}
			<CheckInAside
				isOpen={!!checkInData}
				onClose={handleCloseCheckIn}
				itemData={checkInData}
				onSubmit={handleCheckInSubmit}
				openCheckouts={openCheckouts}
			/>

			{/* Check Out Aside */}
			<CheckOutAside
				isOpen={!!checkOutData}
				onClose={handleCloseCheckOut}
				itemData={checkOutData}
				onSubmit={handleCheckOutSubmit}
			/>

			{/* Product Detail Modal */}
			<ProductDetailModal
				isOpen={!!selectedProduct}
				onClose={() => setSelectedProduct(null)}
				product={selectedProduct}
				onCheckIn={handleOpenCheckIn}
				onCheckOut={handleOpenCheckOut}
			/>
		</div>
	);
}
