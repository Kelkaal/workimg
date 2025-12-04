"use client";
import Image from "next/image";
import React from "react";
import NavItem from "./ui/NavItem";
import Button from "./ui/Button";
import Link from "next/link";

const PRIMARY_COLOR = "#800020";

export default function DesktopNav({ handleScrollToJoin }: { handleScrollToJoin: () => void }) {
	return (
    <>
      <Link
        href="/"
        className="flex items-center space-x-2 cursor-pointer shrink-0"
      >
        <Image
          src="/assets/logo.png"
          alt="Inventrix  Logo"
          width={30}
          height={30}
          className="h-8 w-auto"
        />
        <span className="text-xl sm:text-[24px] font-bold text-[#111827]">
          Inventrix 
        </span>
      </Link>

      <nav className="hidden md:flex absolute inset-x-0 justify-center pointer-events-none">
        <div className="flex space-x-3 items-center pointer-events-auto">
          <NavItem href="#features">Features</NavItem>
          <NavItem href="#benefits">Benefits</NavItem>
          <NavItem href="#faq">FAQ</NavItem>
        </div>
      </nav>

      <div className="flex items-center space-x-4">
        <Button
          className={`
            hidden md:flex 
            text-sm ml-6
            px-5 py-2.5 sm:px-6 sm:py-[15px] font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            
            bg-[${PRIMARY_COLOR}] text-white border border-transparent 
            
            hover:bg-white 
            hover:border-[#800020]
            hover:text-[#000000] 
            hover:cursor-pointer
          `}
          onClick={handleScrollToJoin}
        >
          Join Waitlist
        </Button>
      </div>
    </>
  );
}