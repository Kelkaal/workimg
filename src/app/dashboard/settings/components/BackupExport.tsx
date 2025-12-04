import React, { useState } from "react";
import { Download, Database, FileText, RefreshCw } from "lucide-react";

// ----- TEMPORARY TYPE DEFINITIONS -----
type User = {
  id: string;
  name: string;
  email: string;
};

type InventorySettings = {
  backupFrequency: string;
  retentionPeriod: string;
};
// --------------------------------------

interface BackupExportProps {
  showToast: (message: string, type?: "success" | "error") => void;
  users: User[];
  inventorySettings: InventorySettings;
}

// Helper function to format the date/time
const formatBackupTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatBackupDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function BackupExport({
  showToast,
}: BackupExportProps) {
  // 🚩 NEW STATE: Track the manual backup status and timestamp
  const [lastBackupDetails, setLastBackupDetails] = useState({
    date: new Date(2025, 0, 28, 3, 0, 0), // Initial state: January 28, 2025 at 3:00 AM
    sizeMB: 245,
    status: "Successful",
  });

  const handleBackup = () => {
    // 1. Show immediate toast and set status to running (optional)
    showToast("Backup initiated successfully!", "success");

    // 2. Simulate backup time and success
    setTimeout(() => {
      const newDate = new Date();
      const newSize = (Math.random() * 50 + 200).toFixed(0); // Randomize size for realism

      // 3. Update the state with the new time and details
      setLastBackupDetails({
        date: newDate,
        sizeMB: Number(newSize),
        status: "Successful",
      });

      showToast(`Backup completed - ${newSize} MB saved`, "success");
    }, 2000);
  };

  const handleExportCSV = () => {
    const csvData = [
      ["Product ID", "Name", "Category", "Quantity", "Price", "Last Updated"],
      [
        "PRD001",
        "Laptop Dell XPS",
        "Electronics",
        "15",
        "$999.99",
        "2025-01-20",
      ],
      ["PRD002", "Office Chair", "Furniture", "42", "$299.99", "2025-01-18"],
      ["PRD003", "USB Cable", "Accessories", "200", "$9.99", "2025-01-22"],
      ["PRD004", "Monitor 27in", "Electronics", "8", "$449.99", "2025-01-19"],
      ["PRD005", "Desk Lamp", "Furniture", "30", "$39.99", "2025-01-21"],
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `inventory_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Inventory exported successfully!", "success");
  };

  const handleExportLogs = () => {
    const logData = [
      ["Timestamp", "User", "Action", "Item", "Details"],
      [
        "2025-01-28 14:30",
        "John Doe",
        "Check Out",
        "Laptop Dell XPS",
        "Qty: 2",
      ],
      [
        "2025-01-28 13:15",
        "Mike Johnson",
        "Restock",
        "USB Cable",
        "Added: 50 units",
      ],
      [
        "2025-01-28 12:00",
        "Sarah Williams",
        "Update",
        "Office Chair",
        "Price changed",
      ],
      ["2025-01-28 10:45", "John Doe", "Check In", "Monitor 27in", "Qty: 3"],
      [
        "2025-01-28 09:20",
        "Mike Johnson",
        "Create",
        "Desk Lamp",
        "New item added",
      ],
    ];

    const csvContent = logData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `activity_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Activity logs exported successfully!", "success");
  };

  const handleExportPDF = () => {
    showToast("PDF export started - this may take a moment", "success");
    setTimeout(() => {
      showToast("Reports exported to PDF successfully!", "success");
    }, 1500);
  };

  const handleFullExport = () => {
    showToast("Full database export initiated", "success");
    setTimeout(() => {
      showToast("Database export completed - 2.4 GB", "success");
    }, 3000);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Backup & Export</h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage data backups and exports
      </p>

      <div className="space-y-6">
        {/* Backup Schedule */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Backup Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automatic Backup Schedule
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition">
                <option>Daily at 3:00 AM</option>
                <option>Every 12 hours</option>
                <option>Every 6 hours</option>
                <option>Weekly</option>
                <option>Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Retention Period
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none transition">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
          </div>
        </div>

        {/* Manual Backup */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Manual Backup
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Last Backup</p>
                {/* 🚩 UPDATED: Use the state for real-time update */}
                <p className="text-xs text-gray-600 mt-1">
                  {formatBackupDate(lastBackupDetails.date)} at{" "}
                  {formatBackupTime(lastBackupDetails.date)}
                </p>
                <p className="text-xs text-gray-600">
                  Size: {lastBackupDetails.sizeMB} MB • Status:{" "}
                  {lastBackupDetails.status}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-emerald-700 font-medium">
                    All systems backed up
                  </span>
                </div>
              </div>
              <button
                onClick={handleBackup}
                className="flex items-center gap-2 px-4 py-2 bg-[#900022] text-white rounded-lg text-sm font-medium hover:bg-[#a80025] transition-all active:scale-95 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Backup Now
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#900022] rounded"></span>
            Export Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#900022]/30 transition-all group"
            >
              <Database className="w-4 h-4 text-gray-600 group-hover:text-[#900022] transition-colors" />
              <span>Export Inventory (CSV)</span>
            </button>

            <button
              onClick={handleExportLogs}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#900022]/30 transition-all group"
            >
              <FileText className="w-4 h-4 text-gray-600 group-hover:text-[#900022] transition-colors" />
              <span>Export Activity Logs</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#900022]/30 transition-all group"
            >
              <FileText className="w-4 h-4 text-gray-600 group-hover:text-[#900022] transition-colors" />
              <span>Export Reports (PDF)</span>
            </button>

            <button
              onClick={handleFullExport}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#900022]/30 transition-all group"
            >
              <Download className="w-4 h-4 text-gray-600 group-hover:text-[#900022] transition-colors" />
              <span>Full Database Export</span>
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-4 flex items-start gap-2">
            <span className="text-amber-600">ℹ️</span>
            <span>
              Exports may take a few moments depending on data size. Large
              exports will be sent to your registered email.
            </span>
          </p>
        </div>

        {/* Storage Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Storage Information
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Backup Storage Used</span>
                <span className="font-medium text-gray-900">
                  2.4 GB / 10 GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#900022] h-2 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Backups</p>
                <p className="text-lg font-bold text-gray-900">8</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Total Size</p>
                <p className="text-lg font-bold text-gray-900">2.4 GB</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Oldest</p>
                <p className="text-lg font-bold text-gray-900">28d</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Success Rate</p>
                <p className="text-lg font-bold text-emerald-600">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
