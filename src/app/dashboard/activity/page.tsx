"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface ActivityLog {
  id: string;
  organizationId: string;
  entityId: string;
  entityType: "PRODUCT" | "CATEGORY" | "USER" | "ORGANIZATION";
  activityType: "CREATED" | "UPDATED" | "DELETED";
  description: string;
  userId: string;
  userEmail: string;
  createdOn: string;
}

interface PaginationInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

type EntityTypeFilter = "ALL" | "PRODUCT" | "CATEGORY";

export default function ActivityLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    size: 20,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [entityTypeFilter, setEntityTypeFilter] =
    useState<EntityTypeFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const fetchActivityLogs = async (page = 0, entityType?: string) => {
    setLoading(true);
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let url = `${API_BASE_URL}/api/v1/organizations/${orgId}/activity-logs?page=${page}&size=20`;

      if (entityType && entityType !== "ALL") {
        url += `&entityType=${entityType}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch activity logs");

      const json = await res.json();
      const content = json.data?.content || [];
      const pageInfo = json.data?.page || {
        size: 20,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      };

      setLogs(content);
      setPagination(pageInfo);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs(0, entityTypeFilter);
  }, [entityTypeFilter]);

  const handleFilterChange = (filter: EntityTypeFilter) => {
    setEntityTypeFilter(filter);
    setShowFilterDropdown(false);
  };

  const handlePageChange = (newPage: number) => {
    fetchActivityLogs(newPage, entityTypeFilter);
  };

  const getActivityIcon = (log: ActivityLog) => {
    const desc = log.description.toLowerCase();
    if (desc.includes("checked out")) {
      return <ArrowUpFromLine className="w-4 h-4 text-orange-600" />;
    }
    if (desc.includes("checked in")) {
      return <ArrowDownToLine className="w-4 h-4 text-green-600" />;
    }
    if (log.entityType === "PRODUCT") {
      return <Package className="w-4 h-4 text-blue-600" />;
    }
    if (log.entityType === "CATEGORY") {
      return <FolderOpen className="w-4 h-4 text-purple-600" />;
    }
    return <RefreshCw className="w-4 h-4 text-gray-600" />;
  };

  const getActivityBgColor = (log: ActivityLog) => {
    const desc = log.description.toLowerCase();
    if (desc.includes("checked out")) return "bg-orange-100";
    if (desc.includes("checked in")) return "bg-green-100";
    if (log.entityType === "PRODUCT") return "bg-blue-100";
    if (log.entityType === "CATEGORY") return "bg-purple-100";
    return "bg-gray-100";
  };

  const getActivityTypeBadge = (log: ActivityLog) => {
    const desc = log.description.toLowerCase();
    if (desc.includes("checked out")) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
          Check Out
        </span>
      );
    }
    if (desc.includes("checked in")) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          Check In
        </span>
      );
    }
    switch (log.activityType) {
      case "CREATED":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Created
          </span>
        );
      case "UPDATED":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            Updated
          </span>
        );
      case "DELETED":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            Deleted
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.description.toLowerCase().includes(query) ||
      log.userEmail.toLowerCase().includes(query) ||
      log.entityType.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <DashboardHeader
          title="Activity Logs"
          subtitle="Track all activities in your organization"
        />

        <div className="px-4 sm:px-6 py-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              />
            </div>

            {/* Entity Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {entityTypeFilter === "ALL" ? "All Types" : entityTypeFilter}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {(["ALL", "PRODUCT", "CATEGORY"] as EntityTypeFilter[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange(type)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          entityTypeFilter === type
                            ? "bg-gray-50 text-[#800020]"
                            : "text-gray-700"
                        }`}
                      >
                        {type === "ALL" ? "All Types" : type}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No activity logs found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => router.push(`/dashboard/activity/${log.id}`)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg shrink-0 ${getActivityBgColor(
                          log
                        )}`}
                      >
                        {getActivityIcon(log)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Mobile: Stack vertically */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium break-words">
                              {log.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                              <span className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-none">
                                {log.userEmail}
                              </span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                {log.entityType}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1 mt-1 sm:mt-0">
                            {getActivityTypeBadge(log)}
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatDate(log.createdOn)} at{" "}
                              {formatTime(log.createdOn)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Showing {pagination.number * pagination.size + 1} to{" "}
                {Math.min(
                  (pagination.number + 1) * pagination.size,
                  pagination.totalElements
                )}{" "}
                of {pagination.totalElements} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.number - 1)}
                  disabled={pagination.number === 0}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          pagination.number === i
                            ? "bg-[#800020] text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile: Show current page */}
                <span className="sm:hidden text-sm text-gray-600">
                  {pagination.number + 1} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.number + 1)}
                  disabled={pagination.number >= pagination.totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
