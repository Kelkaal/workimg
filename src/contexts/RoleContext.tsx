"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type UserRole = "OWNER" | "ADMIN" | "STAFF" | null;

interface RoleContextType {
  role: UserRole;
  isAdmin: boolean; // OWNER or ADMIN
  isOwner: boolean;
  isMember: boolean;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isAdmin: false,
  isOwner: false,
  isMember: false,
  loading: true,
  refreshRole: async () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async () => {
    if (typeof window === "undefined") return;

    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const orgId =
        localStorage.getItem("organizationId") ||
        sessionStorage.getItem("organizationId");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !orgId) {
        setRole(null);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/users?page=0&size=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setRole(null);
        setLoading(false);
        return;
      }

      const json = await res.json();
      const users = json.data?.content || [];

      // Find current user by email
      const currentUser = users.find(
        (u: { email: string }) => u.email === userEmail
      );

      if (currentUser) {
        setRole(currentUser.role as UserRole);
        // Store role in localStorage for quick access
        localStorage.setItem("userRole", currentUser.role);
      } else {
        // Fallback: check localStorage
        const storedRole = localStorage.getItem("userRole") as UserRole;
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      // Fallback to stored role
      const storedRole = localStorage.getItem("userRole") as UserRole;
      setRole(storedRole);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  // Listen for organization changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserRole();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchUserRole]);

  const isOwner = role === "OWNER";
  const isAdmin = role === "OWNER" || role === "ADMIN";
  const isStaff = role === "STAFF";
  const isMember = role === "STAFF"; // STAFF is the member/store staff role

  return (
    <RoleContext.Provider
      value={{
        role,
        isAdmin,
        isOwner,
        isMember,
        loading,
        refreshRole: fetchUserRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
