"use client";
import React, { useState } from "react";
import { useEffect } from "react";

const sections = [
	{ id: "introduction", label: "1. Introduction" },
	{ id: "information-we-collect", label: "2. Information We Collect" },
	{ id: "how-we-use-information", label: "3. How We Use Your Information" },
	{ id: "data-sharing", label: "4. Data Sharing" },
	{ id: "data-security", label: "5. Data Security" },
	{ id: "data-retention", label: "6. Data Retention" },
	{ id: "your-privacy-rights", label: "7. Your Privacy Rights" },
	{ id: "cookies-and-tracking", label: "8. Cookies and Tracking Technologies" },
	{ id: "third-party-services", label: "9. Third-Party Services" },
	{ id: "international-transfers", label: "10. International Data Transfers" },
	{ id: "childrens-privacy", label: "11. Children's Privacy" },
	{ id: "changes", label: "12. Changes To This Privacy Policy" },
	{ id: "contact-us", label: "13. Contact Us" },
];

export default function PrivacyPolicyPage() {
	const [activeId, setActiveId] = useState<string>("introduction");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) setActiveId(visible.target.id);
			},
			{
				root: null,
				rootMargin: "0px 0px -50% 0px",
				threshold: [0.1, 0.5, 1],
			}
		);

		sections.forEach((s) => {
			const el = document.getElementById(s.id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	return (
    <div className="min-h-screen w-full flex bg-white text-gray-900">
      {/* Outer container: remove default page padding so sidebar sits flush */}
      <div className="w-full flex">
        {/* Sidebar (flush to left) */}
        <aside
          aria-label="Table of contents"
          className="hidden lg:block w-56 bg-gray-50 border-r border-gray-200 sticky top-0 h-screen"
          style={{ paddingTop: "88px" }} // push content down to align with page header if any
        >
          <div className="px-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Table of Contents
            </h4>

            <nav className="space-y-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={
                    "block py-1 rounded " +
                    (activeId === section.id
                      ? "text-black font-medium"
                      : "text-gray-600 hover:text-black")
                  }
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content column */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold leading-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: January 15, 2024
            </p>
          </header>

          <article className="prose prose-sm lg:prose-lg max-w-none text-gray-700">
            {/* Introduction */}
            <section id="introduction" className="mb-8 scroll-mt-24">
              <p>
                At Inventrix , we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our inventory management platform
                and services. Please read this privacy policy carefully. If you
                do not agree with the terms of this privacy policy, please do
                not access the application.
              </p>

              <p className="mt-4">
                We reserve the right to make changes to this Privacy Policy at
                any time and for any reason. We will alert you about any changes
                by updating the “Last Updated” date of this Privacy Policy. You
                are encouraged to periodically review this Privacy Policy to
                stay informed of updates.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section id="information-we-collect" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                1. Information We Collect
              </h2>

              <h3 className="text-base font-medium mt-4">
                1.1 Personal Information
              </h3>
              <p>
                We collect personal information that you voluntarily provide to
                us when you register on the platform, express an interest in
                obtaining information about our products and services, or
                otherwise contact us. The personal information we collect may
                include:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Name and contact information (email address, phone number,
                  business address)
                </li>
                <li>
                  Business information (company name, business type, tax
                  identification)
                </li>
                <li>
                  Payment information (credit card details, billing address)
                </li>
                <li>
                  Profile information (profile picture, preferences, settings)
                </li>
              </ul>

              <h3 className="text-base font-medium mt-4">
                1.2 Inventory and Business Data
              </h3>
              <p>
                When you use our services, we collect information related to
                your inventory management activities, including:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Product information (names, descriptions, SKUs, barcodes,
                  quantities)
                </li>
                <li>
                  Transaction data (stock movements, orders, sales records)
                </li>
                <li>
                  Supplier and customer information you input into the system
                </li>
                <li>Files and documents you upload to the platform</li>
              </ul>

              <h3 className="text-base font-medium mt-4">
                1.3 Automatically Collected Information
              </h3>
              <p>
                We automatically collect certain information about your device
                and usage patterns, such as:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </section>

            {/* 2. How We Use Your Information */}
            <section id="how-we-use-information" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services, secure accounts, and personalize user
                experience. Examples include:
              </p>

              <ul className="list-disc pl-6 mt-2">
                <li>
                  Provide and maintain our services (process inventory data,
                  generate reports)
                </li>
                <li>Manage your account (authentication, user preferences)</li>
                <li>Process transactions (billing, order processing)</li>
                <li>
                  Improve our services (analytics and feature improvements)
                </li>
                <li>
                  Comply with legal obligations and respond to lawful requests
                </li>
              </ul>
            </section>

            {/* 3. Data Sharing and Disclosure */}
            <section id="data-sharing" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                3. Data Sharing and Disclosure
              </h2>
              <p>
                We may share your information in limited circumstances,
                including:
              </p>

              <h3 className="text-base font-medium mt-3">
                3.1 Service Providers
              </h3>
              <p className="mt-2">
                We may share data with third-party service providers who perform
                services on our behalf (payments, hosting, analytics). These
                parties are contractually obligated to protect your data.
              </p>

              <h3 className="text-base font-medium mt-3">
                3.2 Business Transfers
              </h3>
              <p className="mt-2">
                If we are involved in a sale or reorganization, your information
                may be transferred as part of that transaction.
              </p>

              <h3 className="text-base font-medium mt-3">
                3.3 Legal Requirements
              </h3>
              <p className="mt-2">
                We may disclose information when required by law or to respond
                to lawful requests by public authorities.
              </p>
            </section>

            {/* 4. Data Security */}
            <section id="data-security" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your data including:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Encryption for data in transit and at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security audits and monitoring</li>
                <li>Backup and disaster recovery procedures</li>
              </ul>
            </section>

            {/* 5. Data Retention */}
            <section id="data-retention" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
              <p>
                We retain personal information and inventory data as long as
                necessary to fulfill the purposes described in this policy or as
                required by law.
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Account data retained for duration of subscription</li>
                <li>
                  Backup copies retained for a reasonable period for recovery
                </li>
              </ul>
            </section>

            {/* 6. Your Privacy Rights */}
            <section id="your-privacy-rights" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                6. Your Privacy Rights
              </h2>
              <p>
                Depending on your jurisdiction, you may have rights such as
                access, correction, deletion, and restriction of processing. To
                exercise these rights, contact us using the details in the
                Contact Us section.
              </p>
            </section>

            {/* 7. Cookies */}
            <section id="cookies-and-tracking" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                7. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar technologies to collect usage data
                and improve the experience. You can control cookies through your
                browser settings.
              </p>
            </section>

            {/* 8. Third-Party Services */}
            <section id="third-party-services" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                8. Third-Party Services
              </h2>
              <p>
                Our platform may integrate with third-party services. Each such
                service has its own privacy practices.
              </p>
            </section>

            {/* 9. International Transfers */}
            <section
              id="international-transfers"
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-2xl font-semibold mb-3">
                9. International Data Transfers
              </h2>
              <p>
                Your information may be transferred and maintained on servers
                located outside your jurisdiction. We take steps to ensure
                adequate safeguards are in place when transferring data
                internationally.
              </p>
            </section>

            {/* 10. Children's Privacy */}
            <section id="childrens-privacy" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                10. Children&apos;s Privacy
              </h2>
              <p>
                Our services are not intended for individuals under the age of
                16. We do not knowingly collect personal information from
                children under this age.
              </p>
            </section>

            {/* 11. Changes */}
            <section id="changes" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                11. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page.
              </p>
            </section>

            {/* 12. Contact Us */}
            <section id="contact-us" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>

              <div className="border rounded-md bg-white shadow-sm p-6">
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Email</strong>
                    <div className="text-gray-600 mt-1">
                      privacy@inventrix .com
                    </div>
                  </div>

                  <div>
                    <strong>Phone</strong>
                    <div className="text-gray-600 mt-1">+1 (555) 123-4567</div>
                  </div>

                  <div>
                    <strong>Address</strong>
                    <div className="text-gray-600 mt-1">
                      120 Business Ave, Suite 100
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent card (pink border) */}
              <div className="mt-6 border rounded-md bg-pink-50 border-pink-200 p-4 text-sm text-pink-900">
                By using our platform, you consent to our Privacy Policy and
                agree to its terms. If you do not agree with this policy, please
                do not use our services.
              </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
