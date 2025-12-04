"use client";

import React from "react";
import { FaChartLine, FaBarcode, FaMobileScreen } from "react-icons/fa6";
import { MdNotifications } from "react-icons/md";
import IconCard from "@/components/waitlist/IconCard";

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Whats Coming in Inventrix
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed to revolutionize inventory management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <IconCard
            icon={FaChartLine}
            title="Real-Time Tracking"
            description="Monitor stock levels, movements, and supply chain status across all locations instantly."
            isBenefit={false}
          />
          <IconCard
            icon={MdNotifications}
            title="Smart Alerts"
            description="Automatic notifications for low stock, expiry dates, and optimal reorder points."
            isBenefit={false}
          />
          <IconCard
            icon={FaBarcode}
            title="Barcode Scanning"
            description="Integrated barcode/QR code support with your phone for all major inventory actions."
            isBenefit={false}
          />
          <IconCard
            icon={FaMobileScreen}
            title="Mobile First"
            description="Dedicated iOS and Android apps for managing inventory anywhere, anytime."
            isBenefit={false}
          />
        </div>
      </div>
    </section>
  );
}
