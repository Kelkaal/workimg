"use client"
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center p-4">
			<div className="max-w-xl text-center">
				<div className="p-12 rounded-lg text-black">
					<div className="flex justify-center mb-6">
						<Image
							src="/assets/four-box.png"
							alt="User icon"
							width={52}
							height={52}
							className="h-35 w-35 object-cover"
						/>
					</div>

					<h1 className="text-4xl font-bold mb-3">404</h1>
					<h2 className="text-xl font-semibold mb-6">Page Not Found</h2>
					<p className="text-gray-600 mb-8">
						The page youre looking for doesnt exist or has been moved.
					</p>

					<div className="flex justify-center space-x-4">
						<Link href="/" >
							<div className="flex items-center justify-center px-6 py-3 bg-[#800020] text-white rounded-md hover:border hover:border-[#800020] hover:bg-white  transition duration-150 hover:text-[#800020]">
								<ArrowLeft className="w-6 mb-0.5 h-3" />
								<span>Back to Home</span>
							</div>
						</Link>
						<Link href="/contact">
							<div className="text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-150">
								Contact Us
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
