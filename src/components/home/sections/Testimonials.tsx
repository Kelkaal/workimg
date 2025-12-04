"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reusable star component
const Stars = () => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-5 h-5 text-yellow-500 fill-yellow-500"
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.593z" />
      </svg>
    ))}
  </div>
);

// Data array for testimonials
const TESTIMONIALS = [
  {
    text: `Inventrix transformed how we manage inventory. We've reduced stockouts by 90% and saved countless hours. The real-time tracking is a game-changer!`,
    name: "Michael Chen",
    role: "CEO, TechRetail Co.",
    img: "/assets/michael-chen.png",
  },
  {
    text: `The mobile app is fantastic! I can check stock levels and update inventory from anywhere. Customer support is incredibly responsive and helpful.`,
    name: "Sarah Johnson",
    role: "Operations Manager, FreshMart",
    img: "/assets/sarah.png",
  },
  {
    text: `Setup was incredibly easy. We had our entire inventory running within an hour. The reporting features give us insights we never had before.`,
    name: "David Martinez",
    role: "Founder, GadgetHub",
    img: "/assets/david.png",
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-[#F9FAFB] py-20 px-4 flex flex-col gap-16 md:px-6 lg:px-20"
    >
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-bold text-4xl md:text-5xl text-[#111827]">
          Loved by Businesses Worldwide
        </h1>
        <p className="text-[#4B5563] text-xl max-w-3xl leading-relaxed">
          See what our customers have to say about Inventrix
        </p>
      </header>

      {/* Testimonials */}
      <div className="grid grid-cols-1 gap-8 lg:gap-8 sm:gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className="p-8 flex flex-col gap-8 bg-white rounded-2xl shadow-lg"
          >
            <Stars />
            <p className="text-[#111827] leading-relaxed">
              &quot;{item.text}&quot;
            </p>

            <div className="user flex items-start gap-4">
              <Image
                src={item.img}
                alt={item.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <h6 className="text-[#111827] font-bold">{item.name}</h6>
                <p className="text-sm text-[#4B5563]">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
