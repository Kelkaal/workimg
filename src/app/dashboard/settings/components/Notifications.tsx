import React from "react";
import Toggle from "./Toggle";
import { FeatureFlags } from "../types";

interface NotificationsProps {
  featureFlags: FeatureFlags;
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlags>>;
}

export default function Notifications({
  featureFlags,
  setFeatureFlags,
}: NotificationsProps) {
  const emailNotifications = [
    {
      key: "lowStockEmail" as keyof FeatureFlags,
      label: "Low Stock Alerts",
      desc: "Receive email when items fall below threshold",
    },
    {
      key: "checkoutEmail" as keyof FeatureFlags,
      label: "Check-Out Notifications",
      desc: "Get notified when items are checked out",
    },
    {
      key: "dailySummary" as keyof FeatureFlags,
      label: "Daily Summary Report",
      desc: "Receive daily activity summary via email",
    },
  ];

  const inAppNotifications = [
    {
      key: "systemUpdates" as keyof FeatureFlags,
      label: "System Updates",
      desc: "Notifications about system updates and maintenance",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Notification Settings
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure alert preferences and notifications
      </p>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Email Notifications
          </h3>
          <div className="space-y-4">
            {emailNotifications.map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {notif.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {notif.desc}
                  </div>
                </div>
                <Toggle
                  enabled={featureFlags[notif.key] as boolean}
                  onToggle={() =>
                    setFeatureFlags((f) => ({
                      ...f,
                      [notif.key]: !f[notif.key],
                    }))
                  }
                  label={notif.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            In-App Notifications
          </h3>
          <div className="space-y-4">
            {inAppNotifications.map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {notif.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {notif.desc}
                  </div>
                </div>
                <Toggle
                  enabled={featureFlags[notif.key] as boolean}
                  onToggle={() =>
                    setFeatureFlags((f) => ({
                      ...f,
                      [notif.key]: !f[notif.key],
                    }))
                  }
                  label={notif.label}
                />
              </div>
            ))}

            {/* User Activity - Always enabled example */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  User Activity
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Alerts for user check-ins and check-outs
                </div>
              </div>
              <Toggle
                enabled={true}
                onToggle={() => {}}
                label="User Activity"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Email Preferences */}
        {/* <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Email Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Email
              </label>
              <input
                type="email"
                defaultValue="admin@company.com"
                className="w-full rounded-lg border  px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition bg-[#EFEFEF] border-[#D1D5DB] "
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Frequency
              </label>
              <select className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition bg-[#EFEFEF] border-[#D1D5DB] ">
                <option>Instant</option>
                <option>Hourly Digest</option>
                <option>Daily Digest</option>
                <option>Weekly Summary</option>
              </select>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
