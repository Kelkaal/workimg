"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FAQItemProps } from "../types";

export type { FAQItemProps };

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className="rounded-xl bg-white transition-all duration-500 ease-in-out border border-gray-100"
			style={{
				boxShadow: isOpen
					? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
					: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
			}}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				className="flex justify-between items-center w-full text-left p-6 group cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="text-base md:text-lg font-semibold text-gray-900 pr-4 group-hover:text-[#800020] transition-colors duration-300 cursor-pointer">
					{question}
				</span>
				<ChevronDown
					className={`w-5 h-5 shrink-0 text-gray-500 transition-all duration-500 ease-in-out cursor-pointer ${isOpen ? "rotate-180 text-[#800020]" : "rotate-0"
						}`}
				/>
			</button>

			<div
				className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}
			>
				<div className="overflow-hidden">
					<div className="px-6 pb-6 pt-2 border-t border-gray-100">
						<p className="text-gray-600 text-sm md:text-base leading-relaxed">
							{answer}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function FAQ() {
	return (
		<section id="faq" className="py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-lg text-gray-600">
							Everything you need to know about the waitlist
						</p>
					</div>
					<div className="space-y-4">
						<FAQItem
							question="How does the free trial work?"
							answer="You get full access to all features for 14 days, no credit card required. After the trial, you can choose a plan that fits your needs or continue with our free tier."
						/>
						<FAQItem
							question="Can I import my existing inventory?"
							answer="Yes! You can easily import your inventory using CSV files. We also provide templates and support to help you get started quickly."
						/>
						<FAQItem
							question="Is my data secure?"
							answer="Absolutely. We use bank-level encryption and security measures to protect your data. Your inventory information is backed up daily and stored securely."
						/>
						<FAQItem
							question="Do you offer mobile apps?"
							answer="Yes! We have native apps for both iOS and Android. You can manage your inventory, scan barcodes, and check stock levels from anywhere."
						/>
						<FAQItem
							question="What kind of support do you provide?"
							answer="We offer 24/7 email support, live chat during business hours, and comprehensive documentation. Premium plans include phone support and dedicated account managers."
						/>
						<FAQItem
							question="Can I cancel anytime?"
							answer="Yes, you can cancel your subscription at any time with no penalties. Your data will remain accessible, and you can export it whenever needed."
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

