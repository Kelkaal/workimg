"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        // Removed: console.log("🔍 Auth check - Token exists:", !!token);

        if (token) {
          // Optional: Verify token is valid by making an API call
          // For now, just check if it exists
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};

const UNAUTHENTICATED_REDIRECT = "/signin";

// ✅ Pages that REQUIRE authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/app",
  "/dashboard/product",
  "/dashboard/products",
  "/inventory",
  "/dashboard/profile",
  "/dashboad/settings",
  "/dashboard/categories",
  "/dashboard/reports",
];

// ✅ Pages that should redirect to /app if already logged in
const AUTH_PAGES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const currentPath = pathname || "";

  // Check if current path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    currentPath.startsWith(path)
  );

  // Check if current path is an auth page
  const isAuthPage = AUTH_PAGES.some((path) => currentPath.startsWith(path));

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    /* Removed: console.log("🛡️ Protection check:", {
      path: currentPath,
      isProtected: isProtectedPath,
      isAuthPage: isAuthPage,
      isAuthenticated: isAuthenticated,
    }); */

    // Redirect unauthenticated users from protected pages
    if (isProtectedPath && !isAuthenticated) {
      // Removed: console.log("❌ Not authenticated, redirecting to signin");
      router.replace(UNAUTHENTICATED_REDIRECT);
      return;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
      // Removed: console.log("✅ Already authenticated, redirecting to app");
      router.replace("/app");
      return;
    }
  }, [
    isLoading,
    isProtectedPath,
    isAuthPage,
    isAuthenticated,
    router,
    currentPath,
  ]);

  // Show loading state for protected pages
  if (isLoading && isProtectedPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020]"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (isProtectedPath && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
