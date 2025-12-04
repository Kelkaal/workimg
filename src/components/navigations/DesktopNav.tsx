"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";
import { NAV_LINKS, NavItem } from "./shared";

export default function DesktopNav() {
  return (
    <div className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-2 shrink-0">

          <Image
            src="/assets/logo.png"
            alt="Inventrix  Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />


        <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Inventrix
        </span>
      </Link>

      <nav className="hidden lg:flex items-center gap-6 mx-auto">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.href} href={link.href}>
            {link.label}
          </NavItem>
        ))}
      </nav>

      {/* Desktop buttons - HIDDEN on mobile (lg:flex) */}
      <div className="hidden lg:flex items-center gap-4 shrink-0">
        <Button
          variant="ghost"
          asChild
          className="text-slate-900 border border-transparent hover:border-[#800020] hover:text-[#800020] hover:bg-white transition-all duration-300 ease-in-out cursor-pointer"
        >
          <Link href="/signin">Sign In</Link>
        </Button>

        <Button
          className="text-sm px-6 py-2.5 bg-[#800020] text-white font-semibold shadow-lg border border-[#800020] hover:bg-white hover:text-[#800020] transition-all duration-300 ease-in-out cursor-pointer"
          asChild
        >
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </div>
    </div>
  );
}
