import React from "react";
import Toggle from "./Toggle";
import { SecuritySettings, FeatureFlags } from "../types";
import { Shield, Lock, Key } from "lucide-react";

interface SecuritySettingsProps {
  settings: SecuritySettings;
  setSettings: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  featureFlags: FeatureFlags;
    setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlags>>;
    
}

export default function SecuritySettingsCard({
  settings,
  setSettings,
  featureFlags,
  setFeatureFlags,
}: SecuritySettingsProps) {
  const securityFeatures = [
    {
      key: "twoFactor" as keyof FeatureFlags,
      label: "Two-Factor Authentication",
      desc: "Require 2FA for all admin accounts",
      icon: Shield,
    },
    {
      key: "loginAttemptLimit" as keyof FeatureFlags,
      label: "Login Attempt Limit",
      desc: "Lock account after 5 failed login attempts",
      icon: Lock,
    },
    {
      key: "activityLogging" as keyof FeatureFlags,
      label: "Activity Logging",
      desc: "Log all user activities and system changes",
      icon: Key,
    },
  ];

  const passwordRequirements = [
    { key: "minPasswordLength", label: "Minimum 8 characters" },
    { key: "requireUppercase", label: "Require uppercase letter" },
    { key: "requireNumber", label: "Require number" },
    { key: "requireSpecial", label: "Require special character" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Security Settings
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage security and access control
      </p>

      <div className="space-y-6">
        {/* Session Settings */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Session Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout
              </label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
              >
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>Never</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Automatic logout after period of inactivity
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition">
                <option>Never</option>
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>180 days</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Force password change after this period
              </p>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Password Requirements
          </h3>
          <div className="space-y-3">
            {passwordRequirements.map((req) => (
              <label
                key={req.key}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    settings[req.key as keyof SecuritySettings] as boolean
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [req.key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-[#900022] focus:ring-2 focus:ring-[#900022]/20"
                />
                <span className="text-sm text-gray-700">{req.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Security Features
          </h3>
          <div className="space-y-4">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#900022]/30 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 bg-[#900022]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#900022]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {feature.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {feature.desc}
                      </div>
                    </div>
                  </div>
<Toggle
  enabled={featureFlags[feature.key] as boolean}
  onToggle={() => setFeatureFlags((f: FeatureFlags) => ({
    ...f,
    [feature.key]: !f[feature.key],
  }))}
  label={feature.label}
/>
                </div>
              );
            })}
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            IP Whitelist
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Restrict access to specific IP addresses (optional)
          </p>
          <textarea
            placeholder="Enter IP addresses, one per line&#10;e.g., 192.168.1.1&#10;10.0.0.1"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition font-mono"
          />
        </div>

        {/* Security Status */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900">
                Security Score: Excellent
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Your system is well-protected with{" "}
                {securityFeatures.filter((f) => featureFlags[f.key]).length} of{" "}
                {securityFeatures.length} security features enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
