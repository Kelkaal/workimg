import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Edit,
  FileText,
  Plus,
} from "lucide-react";
import React from "react";
import {useRouter} from 'next/navigation'

const RecentActivity = () => {
	const router = useRouter()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500 mt-1">
            Your latest activity in the system
          </p>
        </div>
        <button
        onClick={() => router.push("/dashboard/activity")}
        className="text-sm text-[#8B1538] font-medium flex items-center gap-2 hover:gap-3 transition-all">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Added new product
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Power Drill - Model KYZ-5003
            </p>
            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Updated product quantity
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Safety Goggles - A+ - 40 units
            </p>
            <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Checked out items
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Internal-Set (3 units) - Mike Johnson
            </p>
            <p className="text-xs text-gray-400 mt-1">Yesterday</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Exported report</p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Monthly Inventory Report (CSV)
            </p>
            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Low stock alert triggered
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              Welding Rods below threshold (5 units)
            </p>
            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
