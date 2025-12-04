"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { FaChartLine, FaCheck, FaClock, FaDollarSign } from "react-icons/fa6";
import gsap from "gsap";

const features = [
  {
    icon: <FaCheck className="text-[#16A34A]" />,
    bg: "bg-[#DCFCE7]",
    title: "Reduce Stockouts by 85%",
    desc: "Never run out of popular items. Smart alerts keep you informed before it’s too late.",
  },
  {
    icon: <FaClock className="text-[#2563EB]" />,
    bg: "bg-[#DBEAFE]",
    title: "Save 10+ Hours Per Week",
    desc: "Automate manual tasks and streamline your inventory processes significantly.",
  },
  {
    icon: <FaDollarSign className="text-[#9333EA]" />,
    bg: "bg-[#F3E8FF]",
    title: "Cut Costs by 30%",
    desc: "Optimize stock levels and reduce excess inventory holding costs dramatically.",
  },
  {
    icon: <FaChartLine className="text-[#800020]" />,
    bg: "bg-[#FCE7EB]",
    title: "Improve Accuracy to 99%",
    desc: "Eliminate human errors with barcode scanning and automated tracking systems.",
  },
];

const WhyInventrix = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.from(".why-image", {
        x: -40,
        opacity: 0,
      })
        .from(".why-heading", {
          y: 20,
          opacity: 0,
        })
        .from(".why-subtext", {
          y: 20,
          opacity: 0,
        })
        .from(".why-feature", {
          opacity: 0,
          y: 25,
          stagger: 0.15,
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 grid grid-cols-1 gap-10 md:px-6 lg:grid-cols-2 lg:px-20"
    >
      {/* IMAGE */}
      <Image
        src="/assets/business-handshake-partnership-image.png"
        alt="Handshake"
        width={380}
        height={275}
        className="why-image w-full rounded-xl"
      />

      {/* TEXT CONTENT */}
      <div className="flex flex-col gap-6">
        <h3 className="why-heading text-[#111827] text-4xl font-bold leading-10">
          Why Businesses Choose Inventrix
        </h3>

        <p className="why-subtext text-[#4B5563] text-lg">
          Join thousands of businesses that have transformed their inventory
          management.
        </p>

        {/* FEATURES LIST */}
        <div className="flex flex-col gap-6">
          {features.map((item, index) => (
            <div key={index} className="why-feature flex items-start gap-4">
              <div
                className={`${item.bg} p-3.5 rounded-xl w-fit flex items-center justify-center`}
              >
                {item.icon}
              </div>

              <div>
                <h5 className="text-[#111827] text-lg font-bold">
                  {item.title}
                </h5>
                <p className="text-[#4B5563]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyInventrix;
