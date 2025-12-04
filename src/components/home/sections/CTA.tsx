import { FaCircleCheck, FaRocket } from "react-icons/fa6";
import Button from "../ui/Button";
import Link from "next/link";

export default function CTA() {
	return (
		<section className="bg-[#800020] py-20">
			<div className="max-w-4xl mx-auto px-6 text-center text-white">
				<h2 className="text-4xl md:text-5xl font-bold mb-6">
					Ready to Transform Your Inventory Management?
				</h2>
				<p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
					Join thousands of businesses already using Inventrix. Start your
					free trial today!
				</p>
				<div className="flex flex-col sm:flex-row gap-6 justify-center">
					<Button
						variant="unstyled"
						className="flex items-center bg-white text-[#800020] justify-center gap-2 py-4 px-6 font-semibold 
             rounded-md cursor-pointer border border-transparent
             transition-all duration-300 ease-out
             hover:bg-[#800020] hover:text-white hover:border-white hover:shadow-lg"
					>
												<FaRocket /> 
						<Link href="/signup">
Start Your 14-Day Free Trial
						</Link>
					</Button>

					{/* <Button
            className="flex items-center justify-center gap-2 py-4 px-6 font-semibold cursor-pointer 
             text-white border border-white rounded-md
             transition-all duration-300 ease-out
             hover:bg-white hover:text-[#800020] hover:shadow-lg"
          >
            <FaCalendar /> Schedule a Demo
          </Button>*/}
				</div>

				<div className="flex flex-row gap-8 items-center justify-center text-[#FCE7EB] mt-8">
					<div className="flex flex-row items-center justify-center gap-4 md:text-sm text-[10px]">
						<FaCircleCheck />
						<p>No credit card required</p>
					</div>
					<div className="flex flex-row items-center justify-center gap-4 text-sm  md:text-sm text-[10px]">
						<FaCircleCheck />
						<p>Setup in minutes</p>
					</div>
					<div className="flex flex-row items-center justify-center gap-4 text-sm  md:text-sm text-[10px]">
						<FaCircleCheck />
						<p>Cancel anytime</p>
					</div>
				</div>
			</div>
		</section>
	);
}
