import React from "react";
import Toggle from "./Toggle"; // Import the Toggle component
import { GeneralSettings, FeatureFlags } from "../types";

interface GeneralSettingsCardProps {
  settings: GeneralSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneralSettings>>;
  featureFlags: FeatureFlags;
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlags>>;
}

export default function GeneralSettingsCard({
  settings,
  setSettings,
  featureFlags,
  setFeatureFlags,
}: GeneralSettingsCardProps) {
  const features = [
    {
      key: "allowStaffAddItems" as keyof FeatureFlags,
      label: "Allow Staff to Add Items",
      desc: "Enable store staff to create new inventory items",
    },
    {
      key: "requireApproval" as keyof FeatureFlags,
      label: "Require Check-Out Approval",
      desc: "Admin approval needed for item check-outs",
    },
    {
      key: "enableSnapshots" as keyof FeatureFlags,
      label: "Enable Item Snapshots",
      desc: "Allow users to capture photos of items",
    },
    {
      key: "trackLocation" as keyof FeatureFlags,
      label: "Track Item Location",
      desc: "Require storage location for all items",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">General Settings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure basic system preferences
      </p>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) =>
              setSettings({ ...settings, companyName: e.target.value })
            }
            className="w-full rounded-lg border bg-[#EFEFEF] border-[#D1D5DB] px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
            placeholder="Enter company name"
          />
        </div>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <input
              type="text"
              value={settings.timeZone}
              onChange={(e) =>
                setSettings({ ...settings, timeZone: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition bg-[#EFEFEF] border-[#D1D5DB] "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <input
              type="text"
              value={settings.dateFormat}
              onChange={(e) =>
                setSettings({ ...settings, dateFormat: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition bg-[#EFEFEF] border-[#D1D5DB] "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full rounded-lg border bg-[#EFEFEF] border-[#D1D5DB]  px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <input
              type="text"
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="w-full rounded-lg border bg-[#EFEFEF] border-[#D1D5DB]  px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
            />
          </div>
        </div>

        {/* Feature Settings */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Feature Settings
          </h3>
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={String(feature.key)}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {feature.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {feature.desc}
                  </div>
                </div>
                <Toggle
                  enabled={featureFlags[feature.key] as boolean}
                  onToggle={() =>
                    setFeatureFlags((f: FeatureFlags) => ({
                      ...f,
                      [feature.key]: !f[feature.key],
                    }))
                  }
                  label={feature.label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
