import React from "react";
// Only import icons used in the screenshot's data points
// import { Server, Database, Users, Package, Activity } from "lucide-react";

interface HealthBarProps {
  label: string;
  value: number;
  color: "green" | "yellow" | "red";
}

// --- HealthBar Component (Defined OUTSIDE SystemInfo) ---
function HealthBar({ label, value, color }: HealthBarProps) {
  // Determine Tailwind classes based on the provided color prop
  const barClass = color === "yellow" ? "bg-amber-500" : "bg-emerald-500";
  // Text class is not used in the final version matching the screenshot,
  // but keeping the logic clean if needed later.

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-900">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${barClass}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

// --- InfoRow Component (MOVED OUTSIDE SystemInfo) ---
// Helper component to render a single row in the simple key/value layout
const InfoRow = ({
  label,
  value,
  isStatus = false,
}: {
  label: string;
  value: string;
  isStatus?: boolean;
}) => (
  <div className="flex justify-between items-center py-2">
    <p className="text-sm text-gray-600">{label}</p>
    {isStatus ? (
      // Status badge matching screenshot style
      <div className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        {value}
      </div>
    ) : (
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    )}
  </div>
);

// Data directly extracted from the screenshot (made constant)
const systemData = {
  applicationVersion: "StoreKeeper v2.4.1",
  databaseVersion: "PostgreSQL 15.2",
  serverStatus: "Online",
  lastUpdated: "January 15, 2025",
  totalUsers: "24 Active Users",
  storageUsed: "2.4 GB / 10 GB",
  totalItems: "1,847 Items",
  totalTransactions: "12,456 Logs",
  health: {
    cpuUsage: 24,
    memoryUsage: 58,
    diskUsage: 24,
  },
};

export default function SystemInfo() {
  const {
    applicationVersion,
    databaseVersion,
    serverStatus,
    lastUpdated,
    totalUsers,
    storageUsed,
    totalItems,
    totalTransactions,
    health,
  } = systemData;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">System Information</h2>
      <p className="text-sm text-gray-600 mb-6">
        View system details and status
      </p>

      {/* --- System Details (Two-Column Layout) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 pb-6 border-b border-gray-200">
        {/* Column 1 */}
        <div className="space-y-1">
          <InfoRow label="Application Version" value={applicationVersion} />
          {/* Note: Server Status is rendered using isStatus=true for the badge */}
          <InfoRow label="Server Status" value={serverStatus} isStatus={true} />
          {/* Screenshot order for column 1 */}
          <InfoRow label="Total Users" value={totalUsers} />
          <InfoRow label="Total Items" value={totalItems} />
        </div>

        {/* Column 2 */}
        <div className="space-y-1">
          <InfoRow label="Database Version" value={databaseVersion} />
          <InfoRow label="Last Updated" value={lastUpdated} />
          <InfoRow label="Storage Used" value={storageUsed} />
          <InfoRow label="Total Transactions" value={totalTransactions} />
        </div>
      </div>

      {/* --- System Health --- */}
      <div className="pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>

        <div className="space-y-4">
          <HealthBar label="CPU Usage" value={health.cpuUsage} color="green" />
          <HealthBar
            label="Memory Usage"
            value={health.memoryUsage}
            color="yellow"
          />
          <HealthBar
            label="Disk Usage"
            value={health.diskUsage}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}
