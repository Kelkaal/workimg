"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  Package,
  LayoutDashboard,
  FolderOpen,
  ClipboardList,
  Settings,
  X,
  Receipt,
  RefreshCw,
  LayoutGrid,
  MoreVertical,
  Grid,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useRole } from "@/contexts/RoleContext";

// --------------------------------------------------
// EXTERNAL STORE FOR PROFILE DATA
// --------------------------------------------------

interface ProfileData {
  userName: string;
  userEmail: string;
  profileImage: string | null;
}

function getProfileFromStorage(): ProfileData {
  if (typeof window === "undefined") {
    return { userName: "User", userEmail: "", profileImage: null };
  }

  let userName = "User";
  let userEmail = "";

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      userName = user.fullName || "User";
      userEmail = user.email || "";
    } else {
      userName = localStorage.getItem("userFullName") || "User";
      userEmail = localStorage.getItem("userEmail") || "";
    }
  } catch {
    userName = localStorage.getItem("userFullName") || "User";
    userEmail = localStorage.getItem("userEmail") || "";
  }

  const profileImage = userEmail
    ? localStorage.getItem(`profileImage_${userEmail}`)
    : null;

  return { userName, userEmail, profileImage };
}

let profileSnapshot: ProfileData = {
  userName: "User",
  userEmail: "",
  profileImage: null,
};
let profileListeners: Array<() => void> = [];

function subscribeToProfile(listener: () => void) {
  profileListeners.push(listener);
  return () => {
    profileListeners = profileListeners.filter((l) => l !== listener);
  };
}

function getProfileSnapshot(): ProfileData {
  return profileSnapshot;
}

const serverProfileSnapshot: ProfileData = {
  userName: "User",
  userEmail: "",
  profileImage: null,
};

function getServerProfileSnapshot(): ProfileData {
  return serverProfileSnapshot;
}

function updateProfileSnapshot() {
  profileSnapshot = getProfileFromStorage();
  for (const listener of profileListeners) {
    listener();
  }
}

if (typeof window !== "undefined") {
  profileSnapshot = getProfileFromStorage();
  window.addEventListener("storage", updateProfileSnapshot);
  window.addEventListener("profileUpdated", updateProfileSnapshot);
}

// --------------------------------------------------
// INNER DASHBOARD SHELL
// --------------------------------------------------

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser } = useUserStore();
  const { isAdmin } = useRole();

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // State for profile menu and logout modal
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileData = useSyncExternalStore(
    subscribeToProfile,
    getProfileSnapshot,
    getServerProfileSnapshot
  );

  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : profileData.userName;
  const userEmail = user?.email || profileData.userEmail;
  const profileImage = user?.photoUrl || profileData.profileImage;

  const getUserInitials = useCallback(() => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const allNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: FolderOpen,
      adminOnly: false,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: Package,
      adminOnly: false,
    },
    {
      name: "Shelves",
      href: "/dashboard/shelves",
      icon: LayoutGrid,
      adminOnly: false,
    },
    {
      name: "Activity Logs",
      href: "/dashboard/activity",
      icon: ClipboardList,
      adminOnly: false,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: Receipt,
      adminOnly: true,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      adminOnly: false,
    },
  ];

  const navigation = allNavigation.filter((item) => !item.adminOnly || isAdmin);

  const isActiveLink = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 rounded-md text-gray-500 hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <Image
            src="/assets/logo.png"
            alt="Inventrix Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
          <div>
            <div className="font-bold text-gray-900">Inventrix</div>
            <div className="text-xs text-gray-500">Inventory management</div>
          </div>
        </div>

        <nav className="p-4 flex flex-col h-[calc(100%-4rem)]">
          <div className="flex-1">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left
                    ${
                      isActive
                        ? "bg-[#900022] text-white shadow-md hover:bg-[#7a001d]"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* PROFILE & MENU */}
          <div className="border-t border-gray-200 p-4 mt-auto">
            <div className="relative flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  router.push("/dashboard/profile");
                  setSidebarOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-linear-gradient-to-br from-[#900022] to-[#600015] text-white flex items-center justify-center overflow-hidden relative shrink-0">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-semibold">{getUserInitials()}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {userName}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {userEmail || "Admin"}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40 overflow-hidden">
                    <button
                      onClick={() => {
                        router.push("/app");
                        setSidebarOpen(false);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors"
                    >
                      <Grid className="w-4 h-4" />
                      <span>Switch Organization</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* SWITCH ORGANIZATION */}
            <div className="border-t border-gray-300 mt-3 pt-2 w-full">
              <button
                onClick={() => {
                  router.push("/app");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Switch Organization</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div>{children}</div>
      </main>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Log out</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add logout logic here
                  router.push("/signin");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
