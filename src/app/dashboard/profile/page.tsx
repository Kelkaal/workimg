"use client";

import PageHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/categories/profile/ProfileCard";
import StatsCards from "@/components/dashboard/categories/profile/StatsCard.jsx/page";
import PersonalInfoForm from "./personal-info-form/page";
import SecuritySettings from "../../../components/dashboard/categories/profile/SecuritySettings";
import NotificationPreferences from "@/components/dashboard/categories/profile/NotificationPrefences";
import RecentActivity from "@/components/dashboard/categories/profile/RecentActivity";
import DangerZone from "./DangerZone";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <section className="flex flex-col">
      {/* Header */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
        rightContent={
          <>
            <NotificationBell />
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              ← Back
            </button>
          </>
        }
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Card */}
          <ProfileCard />
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Personal Information */}
        <PersonalInfoForm />

        {/* Security Settings */}
        <SecuritySettings />

        {/* Notification Preferences */}
        <NotificationPreferences />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Danger Zone */}
        <DangerZone />
      </div>
    </section>
  );
}
