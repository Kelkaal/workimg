// import { Bell } from "lucide-react";
import { useState } from "react";

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    checkOutNotifications: true,
    weeklySummary: false,
    systemUpdates: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6 md:p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Notification Preferences
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Choose what notifications you want to receive
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium text-gray-900">
              Email Notifications
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Receive email updates about your activity
            </p>
          </div>
          <button
            onClick={() => toggleNotification("emailNotifications")}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              notifications.emailNotifications ? "bg-[#8B1538]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.emailNotifications
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium text-gray-900">
              Low Stock Alerts
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Get notified when items are running low
            </p>
          </div>
          <button
            onClick={() => toggleNotification("lowStockAlerts")}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              notifications.lowStockAlerts ? "bg-[#8B1538]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.lowStockAlerts ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium text-gray-900">
              Check-Out Notifications
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Alerts when items are checked out
            </p>
          </div>
          <button
            onClick={() => toggleNotification("checkOutNotifications")}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              notifications.checkOutNotifications
                ? "bg-[#8B1538]"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.checkOutNotifications
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium text-gray-900">
              Weekly Summary Report
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Receive weekly activity summary
            </p>
          </div>
          <button
            onClick={() => toggleNotification("weeklySummary")}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              notifications.weeklySummary ? "bg-[#8B1538]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.weeklySummary ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium text-gray-900">System Updates</p>
            <p className="text-xs text-gray-500 mt-1">
              Important system announcements
            </p>
          </div>
          <button
            onClick={() => toggleNotification("systemUpdates")}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              notifications.systemUpdates ? "bg-[#8B1538]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.systemUpdates ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
