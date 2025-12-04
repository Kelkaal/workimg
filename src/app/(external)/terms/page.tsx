"use client";

const sections = [
  { id: "agreement-to-terms", label: "1. Agreement to Terms" },
  { id: "user-registration", label: "2. User Registration" },
  { id: "subscription-and-payment", label: "3. Subscription and Payment" },
  { id: "free-trial", label: "4. Free Trial" },
  { id: "user-responsibilities", label: "5. User Responsibilities" },
  { id: "intellectual-property", label: "6. Intellectual Property" },
  { id: "user-content", label: "7. User Content" },
  { id: "prohibited-activities", label: "8. Prohibited Activities" },
  { id: "service-availability", label: "9. Service Availability" },
  { id: "limitation-of-liability", label: "10. Limitation of Liability" },
  { id: "indemnification", label: "11. Indemnification" },
  { id: "termination", label: "12. Termination" },
  { id: "modifications-of-service", label: "13. Modifications of Service" },
  { id: "governing-law", label: "14. Governing Law" },
  { id: "contact-information", label: "15. Contact Information" },
];

export default function TermsPage() {
  return (
    <>
      <div className="flex w-full min-h-screen px-4 lg:px-12 py-10 gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 sticky top-24 h-fit border-r pr-4">
          <h3 className="font-semibold text-lg mb-4">Table of Contents</h3>
          <nav className="space-y-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-gray-600 hover:text-black hover:underline text-sm"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>
          <p className="text-[#374151] leading-relaxed my-[47.3px]">
            Welcome to Inventrix . These Terms and Conditions govern your use of
            our inventory management platform and services. By accessing or
            using Inventrix , you agree to be bound by these Terms. If you do
            not agree to these Terms, please do not use our services. <br />
            <br /> Please read these Terms carefully before using our platform.
            These Terms constitute a legally binding agreement between you and
            Inventrix Inc. We reserve the right to modify these Terms at any
            time, and such modifications will be effective immediately upon
            posting.
          </p>

          <div className="space-y-12 text-[#111827] leading-relaxed">
            {/* SECTION 1 */}
            <section id="agreement-to-terms">
              <h2 className="text-3xl font-bold leading-9 mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-[#374151]">
                By creating an account, accessing, or using Inventrix&quot;s
                services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms and Conditions, as well as our
                Privacy Policy. These Terms apply to all users of the platform,
                including but not limited to:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Individual users and business owners</li>
                <li>Employees and team members authorized by account owners</li>
                <li>Trial users and free tier users</li>
                <li>Paid subscribers at all subscription levels</li>
              </ul>
              <p className="text-[#374151]">
                If you are entering into these Terms on behalf of a company or
                other legal entity, you represent that you have the authority to
                bind such entity to these Terms. In such case, &quot;you&quot;
                and &quot;your&quot; will refer to that entity.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="user-registration">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                2. User Registration
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                2.1 Account Creation
              </h3>
              <p className="mt-4 text-[#374151]">
                To use Inventrix , you must create an account by providing
                accurate, complete, and current information. You agree to:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Provide truthful and accurate registration information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>
                  Notify us immediately of any unauthorized access to your
                  account
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account
                </li>
              </ul>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                2.2 Account Eligibility
              </h3>
              <p className="mt-4 text-[#374151]">
                You must be at least 18 years old and have the legal capacity to
                enter into contracts to use Inventrix . By creating an account,
                you represent and warrant that you meet these eligibility
                requirements. We reserve the right to refuse service, terminate
                accounts, or cancel subscriptions at our sole discretion.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                2.3 Account Security
              </h3>
              <p className="mt-4 text-[#374151]">
                You are solely responsible for maintaining the confidentiality
                of your account credentials. We recommend using strong passwords
                and enabling two-factor authentication. You agree to immediately
                notify us of any security breach or unauthorized use of your
                account.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="subscription-and-payment">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                3. Subscription and Payment
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                3.1 Subscription Plans
              </h3>
              <p className="mt-4 text-[#374151]">
                Inventrix offers various subscription plans with different
                features and pricing tiers. By subscribing to our service, you
                agree to pay the subscription fees associated with your chosen
                plan. Subscription fees are billed in advance on a monthly or
                annual basis, depending on your selection.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                3.2 Payment Terms
              </h3>
              <p className="mt-4 text-[#374151]">
                All payments must be made through our approved payment
                processors. You authorize us to charge your designated payment
                method for all subscription fees and any additional charges you
                may incur. If your payment method fails or your account is past
                due, we may suspend or terminate your access to the platform.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                3.3 Refund Policy
              </h3>
              <p className="mt-4 text-[#374151]">
                Subscription fees are generally non-refundable except as
                required by law or as explicitly stated in our refund policy. If
                you cancel your subscription, you will continue to have access
                to the service until the end of your current billing period.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="free-trial">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                4. Free Trial
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                4.1 Trial Period
              </h3>
              <p className="mt-4 text-[#374151]">
                Inventrix may offer a free trial period for new users. During
                the trial period, you will have access to certain features of
                the platform at no charge. The duration and features available
                during the trial period will be specified at the time of
                sign-up.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                4.2 Trial Limitations
              </h3>
              <p className="mt-4 text-[#374151]">
                Free trial accounts may have limitations on storage, number of
                users, or access to premium features. We reserve the right to
                modify or discontinue free trial offers at any time without
                notice.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                4.3 Conversion to Paid Subscription
              </h3>
              <p className="mt-4 text-[#374151]">
                At the end of your free trial period, your account may
                automatically convert to a paid subscription unless you cancel
                before the trial ends. You will be notified before any charges
                are applied to your payment method.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="user-responsibilities">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                5. User Responsibilities
              </h2>
              <p className="text-[#374151]">
                As a user of Inventrix , you are responsible for:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Maintaining accurate and up-to-date account information</li>
                <li>Ensuring the security of your login credentials</li>
                <li>All activities that occur under your account</li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>
                  The accuracy and legality of any data you upload to the
                  platform
                </li>
                <li>
                  Proper use of the platform in accordance with these Terms
                </li>
              </ul>
              <p className="mt-4 text-[#374151]">
                You agree to use Inventrix only for lawful purposes and in a
                manner that does not infringe upon the rights of others or
                restrict their use of the platform.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="intellectual-property">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                6. Intellectual Property
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                6.1 Platform Ownership
              </h3>
              <p className="mt-4 text-[#374151]">
                All content, features, and functionality of Inventrix ,
                including but not limited to software, text, graphics, logos,
                icons, images, audio clips, video clips, data compilations, and
                the design, selection, and arrangement thereof, are the
                exclusive property of Inventrix Inc. or its licensors and are
                protected by international copyright, trademark, patent, trade
                secret, and other intellectual property laws.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                6.2 Limited License
              </h3>
              <p className="mt-4 text-[#374151]">
                Subject to your compliance with these Terms, we grant you a
                limited, non-exclusive, non-transferable, revocable license to
                access and use Inventrix for your internal business purposes.
                This license does not include any right to:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>
                  Modify, copy, or create derivative works of the platform
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble the software
                </li>
                <li>
                  Distribute, sell, lease, or sublicense access to the platform
                </li>
                <li>Remove or alter any proprietary notices or labels</li>
              </ul>
            </section>

            {/* SECTION 7 */}
            <section id="user-content">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                7. User Content
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                7.1 Your Content
              </h3>
              <p className="mt-4 text-[#374151]">
                You retain all ownership rights to any data, information, or
                content you upload, submit, or store on Inventrix (&quot;User
                Content&quot;). By uploading User Content, you grant us a
                worldwide, non-exclusive, royalty-free license to use, store,
                and process your User Content solely for the purpose of
                providing and improving our services.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                7.2 Content Responsibility
              </h3>
              <p className="mt-4 text-[#374151]">
                You are solely responsible for your User Content and the
                consequences of uploading or publishing it. You represent and
                warrant that you own or have the necessary rights to all User
                Content and that such content does not violate any third-party
                rights or applicable laws.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                7.3 Content Monitoring
              </h3>
              <p className="mt-4 text-[#374151]">
                We reserve the right, but have no obligation, to monitor User
                Content and to remove any content that we determine, in our sole
                discretion, violates these Terms or is otherwise objectionable.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="prohibited-activities">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                8. Prohibited Activities
              </h2>
              <p className="text-[#374151]">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>
                  Accessing or attempting to access unauthorized areas of the
                  platform
                </li>
                <li>Interfering with or disrupting the platform or servers</li>
                <li>
                  Using the platform for any illegal or unauthorized purpose
                </li>
                <li>Uploading viruses, malware, or other malicious code</li>
                <li>
                  Attempting to gain unauthorized access to other user accounts
                </li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Impersonating any person or entity</li>
                <li>Collecting or harvesting information about other users</li>
                <li>
                  Using automated systems to access the platform without
                  permission
                </li>
                <li>Circumventing any security features or access controls</li>
              </ul>
              <p className="mt-4 text-[#374151]">
                Violation of these prohibitions may result in immediate
                termination of your account and potential legal action.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="service-availability">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                9. Service Availability
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                9.1 Uptime and Maintenance
              </h3>
              <p className="mt-4 text-[#374151]">
                While we strive to provide continuous access to Inventrix , we
                do not guarantee that the platform will be available at all
                times. The platform may be unavailable during scheduled
                maintenance windows or due to unforeseen technical issues. We
                will make reasonable efforts to notify users of planned
                maintenance in advance.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                9.2 Service Modifications
              </h3>
              <p className="mt-4 text-[#374151]">
                We reserve the right to modify, suspend, or discontinue any
                aspect of the platform at any time, with or without notice. We
                may also impose limits on certain features or restrict access to
                parts of the platform without liability.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="limitation-of-liability">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                10. Limitation of Liability
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                10.1 Disclaimer of Warranties
              </h3>
              <p className="mt-4 text-[#374151] uppercase">
                THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW,
                Inventrix DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                10.2 Limitation of Damages
              </h3>
              <p className="mt-4 text-[#374151] uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, Inventrix SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Your use or inability to use the platform</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>
                  Any interruption or cessation of transmission to or from the
                  platform
                </li>
                <li>
                  Any bugs, viruses, or other harmful code transmitted through
                  the platform
                </li>
                <li>Any errors or omissions in any content</li>
              </ul>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                10.3 Liability Cap
              </h3>
              <p className="mt-4 text-[#374151]">
                In no event shall Inventrix&quot;s total liability to you for
                all damages exceed the amount paid by you to Inventrix in the
                twelve (12) months preceding the claim.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="indemnification">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                11. Indemnification
              </h2>
              <p className="text-[#374151]">
                You agree to indemnify, defend, and hold harmless Inventrix
                Inc., its affiliates, officers, directors, employees, agents,
                licensors, and suppliers from and against all claims, losses,
                expenses, damages, and costs, including reasonable
                attorneys&quot; fees, arising out of or relating to:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Your use of the platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your User Content</li>
                <li>Any breach of your representations and warranties</li>
              </ul>
              <p className="mt-4 text-[#374151]">
                We reserve the right to assume the exclusive defense and control
                of any matter subject to indemnification by you, and you agree
                to cooperate with our defense of such claims.
              </p>
            </section>

            {/* SECTION 12 */}
            <section id="termination">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                12. Termination
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                12.1 Termination by You
              </h3>
              <p className="mt-4 text-[#374151]">
                You may terminate your account at any time by contacting our
                customer support or through your account settings. Upon
                termination, your right to access and use the platform will
                immediately cease.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                12.2 Termination by Us
              </h3>
              <p className="mt-4 text-[#374151]">
                We may suspend or terminate your account immediately, without
                prior notice or liability, for any reason, including but not
                limited to:
              </p>
              <ul className="p-4 space-y-[7.5px] text-[#374151]">
                <li>Breach of these Terms</li>
                <li>Non-payment of subscription fees</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                12.3 Effect of Termination
              </h3>
              <p className="mt-4 text-[#374151]">
                Upon termination, all licenses and rights granted to you under
                these Terms will immediately cease. We may delete your User
                Content and account data, though we may retain certain
                information as required by law or for legitimate business
                purposes. Provisions of these Terms that by their nature should
                survive termination will survive, including ownership
                provisions, warranty disclaimers, indemnity, and limitations of
                liability.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="modifications-of-service">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                13. Modifications of Service and Terms
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                13.1 Changes to the Platform
              </h3>
              <p className="mt-4 text-[#374151]">
                We reserve the right to modify, update, or discontinue any
                features, functionality, or content of Inventrix at any time
                without prior notice. We are not liable to you or any third
                party for any modification, suspension, or discontinuance of the
                platform.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                13.2 Changes to Terms
              </h3>
              <p className="mt-4 text-[#374151]">
                We may revise these Terms from time to time. The most current
                version will always be posted on our website with the &quot;Last
                Updated&quot; date. By continuing to use Inventrix after changes
                become effective, you agree to be bound by the revised Terms. We
                encourage you to review the Terms periodically for any updates.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="governing-law">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                14. Governing Law and Dispute Resolution
              </h2>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                14.1 Governing Law
              </h3>
              <p className="mt-4 text-[#374151]">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Inventrix Inc. is
                incorporated, without regard to its conflict of law provisions.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                14.2 Dispute Resolution
              </h3>
              <p className="mt-4 text-[#374151]">
                Any dispute arising out of or relating to these Terms or the
                platform shall be resolved through binding arbitration in
                accordance with the rules of the applicable arbitration
                association. The arbitration shall take place in the
                jurisdiction where Inventrix Inc. is headquartered. You agree to
                waive any right to a jury trial or to participate in a class
                action lawsuit.
              </p>
              <h3 className="text-xl font-bold leading-7 mt-4 text-[#111827]">
                14.3 Exceptions
              </h3>
              <p className="mt-4 text-[#374151]">
                Either party may seek injunctive or other equitable relief in
                any court of competent jurisdiction to prevent the actual or
                threatened infringement, misappropriation, or violation of
                intellectual property rights.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="contact-information">
              <h2 className="text-3xl font-bold leading-9 mb-4 text-[#111827]">
                15. Contact Information
              </h2>
              <p className="text-[#374151]">
                If you have any questions, concerns, or feedback regarding these
                Terms or Inventrix , please contact us:
              </p>
              <div className="mt-4 text-[#374151] space-y-2">
                <p>
                  <strong>Inventrix Inc.</strong>
                </p>
                <p>Email: support@inventrix .com</p>
                <p>Address: 123 Business Street, Suite 100, City, State, ZIP</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
              <p className="mt-4 text-[#374151]">
                We aim to respond to all inquiries within 2-3 business days.
              </p>
            </section>

            {/* FINAL SECTION */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-[#374151] text-sm">
                By using Inventrix , you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
                Thank you for choosing Inventrix for your inventory management
                needs.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}