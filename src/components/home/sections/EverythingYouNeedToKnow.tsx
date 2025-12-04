"use client"

import React, { useEffect, useRef } from "react";
import IconCard from "@/components/waitlist/IconCard";
import { FaBarcode, FaBell, FaChartLine, FaMobileScreenButton } from "react-icons/fa6";
import { FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FaChartLine,
    title: "Real-Time Tracking",
    description:
      "Monitor stock levels instantly across all your products. Get live updates on inventory movements and never miss a beat.",
  },
  {
    icon: FaBell,
    title: "Smart Alerts",
    description:
      "Receive automatic notifications for low stock, expiring products, and reorder points. Stay ahead of inventory issues.",
  },
  {
    icon: FaBarcode,
    title: "Barcode Scanning",
    description:
      "Scan products quickly with built-in barcode support. Speed up stock takes and reduce manual entry errors.",
  },
  {
    icon: FaMobileScreenButton,
    title: "Mobile Access",
    description:
      "Manage inventory on the go with our mobile app. Update stock, scan items, and check levels from anywhere.",
  },
  {
    icon: FaSyncAlt,
    title: "Multi-Platform Sync",
    description:
      "Seamlessly sync data across all devices. Your inventory is always up-to-date, everywhere you work.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Reliable",
    description:
      "Bank-level encryption and daily backups keep your data safe. 99.9% uptime guarantee for peace of mind.",
  },
];

const EverythingYouNeedToKnow: React.FC = () => {
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
        start: "top 85%",
      },
    });

    // Cards stagger animation
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsRef.current[0],
        start: "top 85%",
      },
    });
  }, []);

  return (
    <section className="flex flex-col gap-16 px-4 py-20 md:px-6 lg:px-20">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1 className="font-bold text-4xl md:text-5xl text-[#111827] leading-10 md:leading-12">
          Everything You Need to Manage Inventory
        </h1>
        <p className="text-[#4B5563] text-xl leading-7 max-w-3xl">
          Powerful features designed to streamline your stock management and boost efficiency
        </p>
      </header>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <IconCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EverythingYouNeedToKnow;
