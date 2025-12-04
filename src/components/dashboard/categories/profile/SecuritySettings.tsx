import { Lock, EyeOff, KeyRound } from "lucide-react";

const SecuritySettings = () => {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
      <p className="text-sm text-gray-500 mb-6">
        Manage password and login safety settings
      </p>

      <div className="space-y-6">
        {/* Change Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-gray-700" />
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
          </div>

          <button className="px-4 py-2 text-sm bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition">
            Update
          </button>
        </div>

        {/* Two-factor auth */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-700" />
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>

          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Enable
          </button>
        </div>

        {/* Device sessions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-gray-700" />
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-gray-500">
                View and manage your logged-in devices
              </p>
            </div>
          </div>

          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            View
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecuritySettings;
