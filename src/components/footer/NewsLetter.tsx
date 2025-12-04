import { PRIMARY_MAROON, INPUT_BG } from "./shared";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
	return (
		<div className="col-span-2 mt-6 md:mt-0">
			<h3 className="font-semibold mb-3">Subscribe to Our Newsletter</h3>
			<p className="text-gray-400 text-sm mb-4">
				Get the latest updates and inventory management tips.
			</p>

			<div className="flex w-full max-w-md">
				<input
					type="email"
					placeholder="Enter your email"
					className="py-3 px-4 flex-1 rounded-l-md text-sm text-white focus:outline-none border border-[#374151]"
					style={{ backgroundColor: INPUT_BG }}
				/>

				<Button
					className="py-6 px-6 flex items-center justify-center rounded-none rounded-r-md text-sm font-semibold whitespace-nowrap hover:brightness-110 hover:cursor-pointer"
					style={{ backgroundColor: PRIMARY_MAROON, color: "white" }}
				>
					Subscribe
				</Button>
			</div>
		</div>
	);
}