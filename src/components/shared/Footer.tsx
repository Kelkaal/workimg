import React from "react";
import Link from "next/link";
import { DARK_BG } from "@/components/footer/shared";
import FooterBrand from "@/components/footer/Brand";
import NewsletterSection from "@/components/footer/NewsLetter";
import FooterColumns from "@/components/footer/Columns";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-12  text-white" style={{ backgroundColor: DARK_BG }}>
			<div className="container sm:flex sm:flex-col sm:items-center sm:justify-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					<FooterBrand />
					<NewsletterSection />
					<FooterColumns />
				</div>

				<div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
					<p>&copy; {currentYear} Inventrix . All rights reserved.</p>

					<div className="flex space-x-6 mt-2 md:mt-0">
						<Link
							href="/privacy-policy"
							className="hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
						<Link href="/terms" className="hover:text-white transition-colors">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}