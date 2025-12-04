import React from "react";
import Link from "next/link";

export const PRIMARY_MAROON = "#800020";
export const ACCENT_COLOR = "#FCE7EB";

export const NAV_LINKS = [
  // { href: "/testimonials", label: "Testimonials" },
    { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export const NavItem = ({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    className={`text-sm font-medium text-slate-900 hover:text-red-700 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);