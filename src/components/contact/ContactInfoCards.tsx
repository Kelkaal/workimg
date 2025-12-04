import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
} from "lucide-react";

export default function ContactInfoCards() {
	const socialLinks = [
		{
			icon: Facebook,
			label: "Facebook",
			href: "https://facebook.com/",
		},
		{
			icon: Twitter,
			label: "Twitter",
			href: "https://twitter.com/",
		},
		{
			icon: Linkedin,
			label: "LinkedIn",
			href: "https://linkedin.com/company/",
		},
		{
			icon: Instagram,
			label: "Instagram",
			href: "https://instagram.com/",
		},
	];

	return (
		<div className="space-y-4 w-full min-w-[400px] mx-auto">
			{/* Email */}
			<Card className="bg-white w-full border-0 shadow-xl rounded-2xl px-5 py-5 flex items-start gap-3 hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
				<div className="bg-[#F9D0D9] p-4 rounded-lg flex items-center justify-center">
					<Image
						src={"/message.svg"}
						alt="Mail Icon"
						width={20}
						height={20}
						className="text-[#800020]"
					/>
				</div>
				<div>
					<h3 className="text-[#111827] font-bold text-[18px] font-weight-[700] leading-3">
						Email
					</h3>
					<p className="text-[14px] text-[#4B5563] font-weight-[400] leading-relaxed mt-3">
						Our team is here to help
					</p>
					<a
						href="mailto:support@inventrix.com"
						className="text-[#800020] font-bold font-weight-[600] text-[14px] leading-relaxed mt-3 block hover:underline"
					>
						support@inventrix.com
					</a>
				</div>
			</Card>

			{/* Phone */}
			<Card className="bg-white w-full border-0 shadow-xl rounded-2xl px-5 py-5 flex items-start gap-3 hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
				<div className="bg-[#F9D0D9] p-4 rounded-lg flex items-center justify-center">
					<Image
						src={"/call.svg"}
						alt="Phone Icon"
						width={20}
						height={20}
						className="text-[#800020]"
					/>
				</div>
				<div>
					<h3 className="text-[#111827] font-bold text-[18px] font-weight-[700] leading-3">
						Phone
					</h3>
					<p className="text-[14px] text-[#4B5563] font-weight-[400] leading-relaxed mt-3">
						Mon–Fri from 8am to 6pm
					</p>
					<a
						href="tel:+1234567890"
						className="text-[#800020] font-weight-[600] font-bold text-[14px] leading-relaxed mt-3 block hover:underline"
					>
						+1 (234) 567-890
					</a>
				</div>
			</Card>

			{/* Social Follow Card */}
			<Card className="bg-[#800020] w-full text-white rounded-2xl px-5 py-5 shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
				<h3 className="text-[18px] font-bold mb-1">Follow Us</h3>
				<p className="text-red-100 mb-2">Stay connected on social media</p>
				<div className="flex gap-2">
					{socialLinks.map(({ icon: Icon, label, href }) => (
						<a
							key={label}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Follow us on ${label}`}
							className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out transform hover:scale-110"
						>
							<Icon className="w-6 h-6" />
						</a>
					))}
				</div>
			</Card>
		</div>
	);
}
