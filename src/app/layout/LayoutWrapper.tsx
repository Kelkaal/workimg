"use client";

import React from "react";
import { usePathname } from "next/navigation";
import LayoutFooter from "./LayoutFooter";
import LayoutHeader from "./LayoutHeader";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPath = pathname || "";

  // Routes that don't need header/footer (auth pages and app pages)
  const isAuthRoute =
    currentPath.startsWith("/signin") ||
    currentPath.startsWith("/signup") ||
    currentPath.startsWith("/forgot-password") ||
    currentPath.startsWith("/reset-password") ||
    currentPath.startsWith("/reset-success") ||
    currentPath.startsWith("/app") ||
    currentPath.startsWith("/dashboard") ||
    currentPath.startsWith("/product") ||
    currentPath.startsWith("/home") ||
    currentPath.startsWith("/confirm-email") ||
    currentPath.startsWith("/waitlist") ||
    currentPath.startsWith("/auth");

  // Debug: Log to see what's happening
  console.log("Current path:", currentPath);
  console.log("Is auth route:", isAuthRoute);

  return (
    <>
      {!isAuthRoute && <LayoutHeader />}
      {children}
      {!isAuthRoute && <LayoutFooter />}
    </>
  );
}
