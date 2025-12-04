"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function PageHeader({
	title,
	subtitle,
	leftContent,
	rightContent,
}: {
	title: string;
	subtitle?: React.ReactNode;
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
}) {
	const { toggleSidebar } = useSidebar();

	return (
		<div className="sticky left-0 right-0 top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3">
					<button
						onClick={toggleSidebar}
						className="rounded-lg hover:bg-gray-100 lg:hidden text-gray-600 pt-1"
					>
						<Menu className="w-6 h-6" />
					</button>

					{leftContent}

					<div>
						<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
						{subtitle && (
							<div className="text-sm text-gray-500 mt-1">{subtitle}</div>
						)}
					</div>
				</div>

				{rightContent && (
					<div className="flex items-center gap-3">{rightContent}</div>
				)}
			</div>
		</div>
	);
}
