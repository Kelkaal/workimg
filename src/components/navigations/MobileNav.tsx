"use client";

import React from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, ACCENT_COLOR, PRIMARY_MAROON, NavItem } from "./shared";

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (state: boolean) => void;
}

export default function MobileNav({
  isMenuOpen,
  setIsMenuOpen,
}: MobileNavProps) {
  return (
    <>
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <button
        className="lg:hidden p-2 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 max-w-full shadow-2xl z-50 transform transition-transform duration-300 ease-in-out  ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: ACCENT_COLOR,
        }}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center h-16 px-4 border-b border-gray-200">
          <span className="text-lg font-bold text-[#111827]">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-gray-900 cursor-pointer"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Navigation Items */}
        <div className="flex flex-col space-y-2 py-4 px-4 justify-between">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              className="py-2 text-slate-800 hover:text-red-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavItem>
          ))}

          {/* Auth Buttons */}
          <div className="pt-4 border-t border-gray-200 space-y-2 mt-30">
            <Button
              variant="ghost"
              asChild
              className="w-full text-[#800020] hover:bg-[#F9D0D9] border border-[#800020] flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/signin">Sign In</Link>
            </Button>

            <Button
              className="w-full text-sm font-semibold"
              style={{ backgroundColor: PRIMARY_MAROON, color: "white" }}
              asChild
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
