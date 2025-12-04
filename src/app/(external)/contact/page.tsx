"use client";

import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import Navbar from "@/components/navigations/Navbar";
import Footer from "@/components/shared/Footer";

export default function ContactPage() {
	return (
		<>
			<Navbar />
			<main className="bg-[#F9FAFB] pt-8 pb-16 overflow-x-hidden">
				<div className="max-w-7xl mx-auto mt-8">
					<ContactHero />
					<section className="w-full">
						<div className="px-6 sm:px-10 py-10 grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
							<ContactForm />
							<ContactInfoCards />
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}