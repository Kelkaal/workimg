// app/dashboard/settings/page.tsx (FIXED)
"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, RefObject, useEffect } from "react";
import {
  Settings,
  Users,
  Bell,
  Package,
  Shield,
  Database,
  Info,
  Save,
  Building2,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import GeneralSettings from "./components/GeneralSettings";
import UserManagement from "./components/UserManagement";
import Notifications from "./components/Notifications";
import InventorySettingsComponent from "./components/InventorySettings";
import SecuritySettings from "./components/SecuritySettings";
import BackupExport from "./components/BackupExport";
import SystemInfo from "./components/SystemInfo";
import SwitchOrganization from "./components/SwitchOrganization";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLocalStorage, useToast } from "./hooks";
import { InventorySettings, User } from "./types";
import { useRole } from "@/contexts/RoleContext";

export default function SettingsPage() {
  const router = useRouter();
  const { toasts, showToast } = useToast();
  const { isAdmin } = useRole();
  const [activeSection, setActiveSection] = useState("general");
  const [isClient, setIsClient] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Refs for each section
  const organizationRef = useRef<HTMLDivElement>(null);
  const generalRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const backupRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // All your state with useLocalStorage
  const [featureFlags, setFeatureFlags] = useLocalStorage(
    "inventrix_features",
    {
      allowStaffAddItems: false,
      requireApproval: true,
      enableSnapshots: true,
      trackLocation: true,
      lowStockEmail: true,
      checkoutEmail: true,
      dailySummary: false,
      systemUpdates: true,
      preventNegativeStock: true,
      requireNotesAdjustments: true,
      twoFactor: false,
      loginAttemptLimit: true,
      activityLogging: true,
    }
  );

  const [generalSettings, setGeneralSettings] = useLocalStorage(
    "inventrix_general",
    {
      companyName: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: "MM/DD/YYYY",
      currency: "USD ($)",
      language: "English",
    }
  );

  const [inventorySettings, setInventorySettings] = useLocalStorage(
    "inventrix_inventory",
    {
      lowStockThreshold: 10,
      autoArchiveDays: "90 days",
      defaultUnit: "Pieces",
      backupFrequency: "Weekly",
      retentionPeriod: "6 months",
    } as InventorySettings
  );

  const [securitySettings, setSecuritySettings] = useLocalStorage(
    "inventrix_security",
    {
      sessionTimeout: "30 minutes",
      minPasswordLength: true,
      requireUppercase: true,
      requireNumber: true,
      requireSpecial: false,
    }
  );

  // FIX: Initialize with a function to safely access localStorage only on client
  const getInitialUsers = (): User[] => {
    if (typeof window === "undefined") {
      // Server-side: return default values
      return [
        {
          id: "1",
          name: "Admin User",
          email: "admin@company.com",
          role: "Admin" as const,
          status: "Active",
          lastActive: "Just now",
          avatar: "AU",
        },
      ];
    }

    // Client-side: safely access localStorage
    const userName = localStorage.getItem("userName") || "Admin User";
    const userEmail = localStorage.getItem("userEmail") || "admin@company.com";
    const avatar = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return [
      {
        id: "1",
        name: userName,
        email: userEmail,
        role: "Admin" as const,
        status: "Active",
        lastActive: "Just now",
        avatar: avatar,
      },
    ];
  };

  const [users, setUsers] = useLocalStorage(
    "inventrix_users",
    getInitialUsers()
  );

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, RefObject<HTMLDivElement | null>> = {
      organization: organizationRef,
      general: generalRef,
      users: usersRef,
      notifications: notificationsRef,
      inventory: inventoryRef,
      security: securityRef,
      backup: backupRef,
      system: systemRef,
    };

    const targetRef = refs[sectionId];
    targetRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(sectionId);
  };

  const handleSaveAll = () => {
    showToast("Settings saved successfully!", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("organizationId");
    sessionStorage.removeItem("organizationId");
    setShowLogoutModal(false);
    router.push("/home");
  };

  // Sidebar items - filter based on role
  const allSidebarItems = [
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      adminOnly: true,
    },
    { id: "general", label: "General", icon: Settings, adminOnly: false },
    { id: "users", label: "Users", icon: Users, adminOnly: true },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      adminOnly: false,
    },
    { id: "inventory", label: "Inventory", icon: Package, adminOnly: true },
    { id: "security", label: "Security", icon: Shield, adminOnly: false },
    { id: "backup", label: "Backup & Export", icon: Database, adminOnly: true },
    { id: "system", label: "System Info", icon: Info, adminOnly: false },
    { id: "logout", label: "Log Out", icon: LogOut, adminOnly: false },
  ];

  // Filter sidebar items based on role
  const sidebarItems = allSidebarItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    const sections = [
      organizationRef.current,
      generalRef.current,
      usersRef.current,
      notificationsRef.current,
      inventoryRef.current,
      securityRef.current,
      backupRef.current,
      systemRef.current,
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] ">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
              } text-white`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <DashboardHeader
        title="Settings"
        subtitle="Manage your system configuration and preferences"
        rightContent={
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white bg-[#900022] hover:bg-[#a80025] shadow-md transition"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        }
      />

      <div className="mx-auto max-w-7xl space-y-6 py-6">

        {/* Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-3 px-4 py-3 md:px-6 lg:px-8">
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;

                  // Special handling for logout
                  if (item.id === "logout") {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setShowLogoutModal(true)}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition text-red-600 hover:bg-red-50 mt-4 border-t border-gray-200 pt-4"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${activeSection === item.id
                          ? "bg-[#900022] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Scrollable Content - filtered based on role */}
          <section className="lg:col-span-9 space-y-6">
            {/* General Settings - visible to all */}
            <div ref={generalRef} id="general" className="scroll-mt-6">
              <GeneralSettings
                settings={generalSettings}
                setSettings={setGeneralSettings}
                featureFlags={featureFlags}
                setFeatureFlags={setFeatureFlags}
              />
            </div>

            {/* User Management - Admin only */}
            {isAdmin && (
              <div ref={usersRef} id="users" className="scroll-mt-6">
                <UserManagement
                  users={users}
                  setUsers={setUsers}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Notifications - visible to all */}
            <div
              ref={notificationsRef}
              id="notifications"
              className="scroll-mt-6"
            >
              <Notifications
                featureFlags={featureFlags}
                setFeatureFlags={setFeatureFlags}
              />
            </div>

            {/* Inventory Settings - Admin only */}
            {isAdmin && (
              <div ref={inventoryRef} id="inventory" className="scroll-mt-6">
                <InventorySettingsComponent
                  settings={inventorySettings}
                  setSettings={setInventorySettings}
                  featureFlags={featureFlags}
                  setFeatureFlags={setFeatureFlags}
                />
              </div>
            )}

            {/* Security Settings - visible to all */}
            <div ref={securityRef} id="security" className="scroll-mt-6">
              <SecuritySettings
                settings={securitySettings}
                setSettings={setSecuritySettings}
                featureFlags={featureFlags}
                setFeatureFlags={setFeatureFlags}
              />
            </div>

            {/* Backup & Export - Admin only */}
            {isAdmin && (
              <div ref={backupRef} id="backup" className="scroll-mt-6">
                <BackupExport
                  showToast={showToast}
                  users={users}
                  inventorySettings={inventorySettings}
                />
              </div>
            )}

            {/* System Info - visible to all */}
            <div ref={systemRef} id="system" className="scroll-mt-6">
              <SystemInfo />
            </div>
          </section>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Logout
              </h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your Inventrix account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#900022] text-white rounded-lg hover:bg-[#7a001d] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
