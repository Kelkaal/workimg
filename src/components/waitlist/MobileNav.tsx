"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";
import NavItem from "./ui/NavItem";

const ACCENT_COLOR = "#FCE7EB";
const PRIMARY_COLOR = "#800020";

export default function MobileNav({
	isMenuOpen,
	setIsMenuOpen,
	handleNavItemClick,
	handleScrollToJoin,
}: {
	isMenuOpen: boolean;
	setIsMenuOpen: (v: boolean) => void;
	handleNavItemClick: () => void;
	handleScrollToJoin: () => void;
}) {
	return (
		<>
			{/* Mobile Toggle */}
			<button
				className="md:hidden p-2 cursor-pointer"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				aria-label="Toggle Menu"
			>
				{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Backdrop */}
			{isMenuOpen && (
				<div
					className="md:hidden fixed inset-0 bg-black/30 z-40 cursor-pointer"
					onClick={() => setIsMenuOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`md:hidden fixed top-0 right-0 h-full w-64 max-w-full shadow-2xl z-50 transform transition-transform duration-300 ease-in-out`}
				style={{
					backgroundColor: ACCENT_COLOR,
					transform: isMenuOpen ? "translateX(0%)" : "translateX(100%)",
				}}
			>
				<div className="flex justify-end items-center h-16 px-4 border-b border-gray-200 cursor-pointer">
					{/* <span className="text-lg font-bold text-[#111827]">Menu</span> */}
					<button
						onClick={() => setIsMenuOpen(false)}
						className="p-2 text-gray-700 hover:text-gray-900 cursor-pointer"
						aria-label="Close Menu"
					>
						<X size={24} />
					</button>
				</div>

				<div className="flex flex-col space-y-2 py-4">
					<NavItem href="#features" onClick={handleNavItemClick}>
						Features
					</NavItem>
					<NavItem href="#benefits" onClick={handleNavItemClick}>
						Benefits
					</NavItem>
					<NavItem href="#faq" onClick={handleNavItemClick}>
						FAQ
					</NavItem>

					<div className="pt-4 mt-2 border-t border-gray-200 px-4">
						<Button
							variant="primary"
							className="w-full text-base"
							style={{ background: PRIMARY_COLOR }}
							onClick={() => {
								handleNavItemClick();
								handleScrollToJoin();
							}}
						>
							Join Waitlist
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}