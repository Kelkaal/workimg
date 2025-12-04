import Link from "next/link";

export default function FooterColumns() {
	return (
		<>
			{/* Company */}
			<div className="col-span-1">
				<h3 className="font-semibold mb-4 text-white">Company</h3>
				<ul className="space-y-3 text-sm text-gray-400">
					<li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
					<li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
					<li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
				</ul>
			</div>
		</>
	);
}