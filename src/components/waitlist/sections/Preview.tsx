"use client";

import React from "react";
import Image from "next/image";
import { FaCalendarCheck } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { PRIMARY_COLOR } from "@/lib/constants";

export default function Preview() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden ">
          <Image
            src="/assets/dashboard-preview.png"
            alt="Inventrix Dashboard Preview"
            width={1200}
            height={675}
            className="w-full h-auto"
          />

          {/* Launch Date Float - Top Right */}
          <div
            className="hidden absolute top-3 right-3 sm:top-6 sm:right-12 lg:top-8 lg:right-14 text-white font-semibold shadow-lg sm:flex items-center p-2 sm:p-3 lg:p-4 rounded-lg gap-2 sm:gap-3"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <div className="bg-white/20 p-2 sm:p-2.5 lg:p-3 rounded-full">
              <FaCalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <p className="font-bold text-base sm:text-xl lg:text-2xl">
                Q2 2026
              </p>
              <p className="font-medium text-[10px] sm:text-xs lg:text-sm opacity-90">
                Launch Date
              </p>
            </div>
          </div>

          {/* Waitlist Count Float - Bottom Left */}
          <div className="hidden absolute bottom-3 left-3 sm:bottom-6 sm:left-12 lg:bottom-12 lg:left-14 bg-white font-semibold shadow-lg sm:flex items-center p-2 sm:p-4 lg:p-6 rounded-lg gap-2 sm:gap-3">
            <div className="bg-[#FCE7EB] p-2 sm:p-2.5 lg:p-3 rounded-full">
              <HiUserGroup
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                style={{ color: PRIMARY_COLOR }}
              />
            </div>
            <div>
              <p className="font-bold text-base sm:text-xl lg:text-2xl text-gray-900">
                2,867
              </p>
              <p className="font-medium text-[10px] sm:text-xs lg:text-sm text-gray-600">
                On waitlist
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
