import React from "react";
import Toggle from "./Toggle";
import { InventorySettings, FeatureFlags } from "../types"; // Create a types file

interface InventorySettingsProps {
  settings: InventorySettings;
  setSettings: React.Dispatch<React.SetStateAction<InventorySettings>>;
  featureFlags: FeatureFlags;
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlags>>;
}

export default function InventorySettingsCard({
  settings,
  setSettings,
  featureFlags,
  setFeatureFlags,
}: InventorySettingsProps) {
  const inventoryRules = [
    {
      key: "preventNegativeStock" as keyof FeatureFlags,
      label: "Prevent Negative Stock",
      desc: "Block check-outs that would result in negative quantities",
    },
    {
      key: "requireNotesAdjustments" as keyof FeatureFlags,
      label: "Require Notes for Adjustments",
      desc: "Force users to add notes when adjusting quantities",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Inventory Settings
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure inventory tracking preferences
      </p>

      <div className="space-y-6">
        {/* Inventory Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Low Stock Threshold
            </label>
            <input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  lowStockThreshold: parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
              min="0"
            />
            <p className="text-xs text-gray-600 mt-1">
              Default threshold for low stock alerts (can be overridden per
              item)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Archive Inactive Items After
            </label>
            <input
              type="text"
              value={settings.autoArchiveDays}
              onChange={(e) =>
                setSettings({ ...settings, autoArchiveDays: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
              placeholder="e.g., 90 days"
            />
            <p className="text-xs text-gray-600 mt-1">
              Items with no activity will be auto-archived
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Unit of Measurement
            </label>
            <select
              value={settings.defaultUnit}
              onChange={(e) =>
                setSettings({ ...settings, defaultUnit: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition"
            >
              <option>Pieces</option>
              <option>Boxes</option>
              <option>Pallets</option>
              <option>Units</option>
              <option>Kilograms</option>
              <option>Liters</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Format
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition">
              <option>UPC-A</option>
              <option>EAN-13</option>
              <option>Code 128</option>
              <option>QR Code</option>
            </select>
          </div>
        </div>

        {/* Inventory Rules */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Inventory Rules
          </h3>
          <div className="space-y-4">
            {inventoryRules.map((rule) => (
              <div
                key={rule.key}
                className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {rule.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {rule.desc}
                  </div>
                </div>
                <Toggle
                  enabled={featureFlags[rule.key] as boolean}
                  onToggle={() =>
                    setFeatureFlags((f) => ({
                      ...f,
                      [rule.key]: !f[rule.key],
                    }))
                  }
                  label={rule.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Stock Alert Settings
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-amber-600 text-lg">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  Low Stock Alerts Active
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Youll receive notifications when any item falls below its
                  threshold. Currently monitoring{" "}
                  <span className="font-semibold">1,847 items</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reorder Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Auto-Reorder Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable Auto-Reorder
              </label>
              <select className="w-full rounded-lg border bg-[#EFEFEF] border-[#D1D5DB]  px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition">
                <option>Disabled</option>
                <option>Enabled (Manual Approval)</option>
                <option>Enabled (Auto-Approve)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Point Multiplier
              </label>
              <input
                type="number"
                defaultValue={1.5}
                step="0.1"
                min="1"
                max="5"
                className="w-full rounded-lg border  px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition bg-[#EFEFEF] border-[#D1D5DB] "
              />
              <p className="text-xs text-gray-600 mt-1">
                Multiply low stock threshold for reorder quantity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
