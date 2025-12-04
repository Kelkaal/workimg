"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FAQItemProps } from "./types";

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
          className={`w-5 h-5 shrink-0 text-gray-500 transition-all duration-500 ease-in-out cursor-pointer ${
            isOpen ? "rotate-180 text-[#800020]" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
              question="When will Inventrix launch?"
              answer="We're planning to launch in Q2 2026. Waitlist members will be notified first and get early access before the public launch."
            />
            <FAQItem
              question="Is joining the waitlist free?"
              answer="Yes, absolutely! Joining the waitlist is completely free and comes with no obligations. You'll just receive updates and early access when we launch."
            />
            <FAQItem
              question="What are the early bird benefits?"
              answer="Waitlist members get 50% off their first year, priority access, exclusive features, dedicated support, and the ability to influence our product roadmap."
            />
            <FAQItem
              question="Will my data be secure?"
              answer="Absolutely. We use bank-level encryption and follow industry best practices for data security. Your information will never be shared with third parties."
            />
            <FAQItem
              question="Can I cancel my waitlist registration?"
              answer="Yes, you can unsubscribe from the waitlist at any time using the link in any of our emails. No questions asked."
            />
            <FAQItem
              question="What happens after I join?"
              answer="You'll receive a confirmation email immediately, followed by regular updates about our progress. When we launch, you'll be among the first to know and get priority access."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
