"use client";

import { InventoryProvider } from "@/contexts/InventoryDataContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PageHeader from "@/components/dashboard/DashboardHeader";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { useUserStore } from "@/stores/userStore";

export default function DashboardPage() {
  const { user } = useUserStore();
  const firstName = user?.firstName || "there";

  return (
    <InventoryProvider>
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${firstName}! Here's your inventory summary`}
        rightContent={<NotificationBell />}
      />
      <DashboardShell />
    </InventoryProvider>
  );
}
