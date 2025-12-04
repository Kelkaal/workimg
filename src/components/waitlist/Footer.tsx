"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
    <footer className="bg-[#111827] text-[#D1D5DB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4 sm:py-8 text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <a href="#" className="flex items-center space-x-2 cursor-pointer">
              <Image
                src="/assets/logo.png"
                alt="Inventrix  Logo"
                width={30}
                height={30}
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold">Inventrix </span>
            </a>
            {/* Motto added below the logo/title */}
            <p className="text-gray-400 text-[10px] mt-1 sm:ml-9">
              Smart inventory management made simple for modern businesses.
            </p>
          </div>

          {/* RIGHT: Copyright and Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0  text-[#D1D5DB] text-xs sm:text-[10px] gap-4 sm:mt-8">
            <div className=" text-[#9CA3AF]">
              &copy; {currentYear} Inventrix . All rights reserved.
            </div>
            <div className="flex order-1 sm:order-2 gap-2">
              <a href="/privacy-policy" className="hover:text-white hover:underline">
                Privacy Policy
              </a>
              <a href="/cookies-policy" className="hover:text-white hover:underline">
                .Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}