"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: 1,
    title: "Sign Up Free",
    description:
      "Create your account in seconds. No credit card required for your 14-day free trial.",
    image: "/assets/sign-up-image.png",
  },
  {
    number: 2,
    title: "Add Your Products",
    description:
      "Import your inventory via CSV or add products manually. Bulk upload supported.",
    image: "/assets/add-product-image.png",
  },
  {
    number: 3,
    title: "Start Managing",
    description:
      "Track stock, set alerts, generate reports, and optimize your inventory effortlessly.",
    image: "/assets/manage-inventory-image.png",
  },
];

const GetStarted = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
      },
    });

    // Card animations
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.25,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsRef.current[0],
        start: "top 85%",
      },
    });
  }, []);

  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header
          ref={headerRef}
          className="flex flex-col items-center gap-4 text-center mb-12"
        >
          <h2 className="font-bold text-4xl md:text-5xl text-[#111827]">
            Get Started in Minutes
          </h2>
          <p className="text-[#6B7280] text-lg max-w-3xl">
            Simple setup process to get your inventory management up and running
          </p>
        </header>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Number Badge */}
              <div className="w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-xl mb-4">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Image Container */}
              <div className="relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Arrow (only for first two cards on desktop) */}
               {/*index < 2 && (
              //   <div className=" sm:flex absolute lg:top-1/2 sm:bottom-1/2 -right-3 transform -translate-y-1/2 z-10">
              //     <div className="w-8 h-8 flex items-center justify-center">
              //       <FaArrowRight className="text-[#F4A8B8] w-4 h-4" />
              //     </div>
              //   </div>
              // )*/}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
