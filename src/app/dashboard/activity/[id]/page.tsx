"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronRight,
  Package,
  Download,
  AlertCircle,
  User,
  Clock,
  MessageSquare,
  Camera,
  Printer,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface ActivityLog {
  id: string;
  organizationId: string;
  entityId: string;
  entityType: string;
  activityType: string;
  description: string;
  userId: string;
  userEmail: string;
  createdOn: string;
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  categoryName: string;
  totalQuantity: number;
  availableQuantity: number;
  checkedOutQuantity: number;
}

interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  phone?: string;
  role?: string;
}

interface Transaction {
  id: string;
  transactionType: string;
  quantity: number;
  createdOn: string;
  reason?: string;
  checkOutStatus?: string;
  userId: string;
}

export default function ActivityLogDetails() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const [log, setLog] = useState<ActivityLog | null>(null);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [relatedLogs, setRelatedLogs] = useState<ActivityLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantityChange, setQuantityChange] = useState({
    before: 0,
    after: 0,
    change: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const orgId =
          sessionStorage.getItem("organizationId") ||
          localStorage.getItem("organizationId");
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        // 1. Fetch activity logs to find current log
        const logsRes = await fetch(
          `${API_BASE_URL}/api/v1/organizations/${orgId}/activity-logs?page=0&size=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const logsJson = await logsRes.json();
        const allLogs = logsJson.data?.content || [];
        const currentLog = allLogs.find((l: ActivityLog) => l.id === logId);

        if (!currentLog) {
          router.push("/dashboard/activity");
          return;
        }
        setLog(currentLog);

        // 2. Get related logs for same entity
        const related = allLogs.filter(
          (l: ActivityLog) =>
            l.entityId === currentLog.entityId && l.id !== logId
        );
        setRelatedLogs(related);

        // 3. Fetch product details if PRODUCT type
        if (currentLog.entityType === "PRODUCT") {
          try {
            const productRes = await fetch(
              `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${currentLog.entityId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (productRes.ok) {
              const productJson = await productRes.json();
              setProduct(productJson.data);

              // Extract quantity from description
              const qtyMatch = currentLog.description.match(/(\d+)\s*units/);
              const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
              const isCheckIn = currentLog.description
                .toLowerCase()
                .includes("checked in");

              // Calculate quantity change based on current product state
              const currentTotal = productJson.data.totalQuantity;
              if (isCheckIn) {
                setQuantityChange({
                  before: currentTotal - qty,
                  after: currentTotal,
                  change: qty,
                });
              } else {
                setQuantityChange({
                  before: currentTotal + qty,
                  after: currentTotal,
                  change: -qty,
                });
              }
            }

            // 4. Fetch product transactions for timeline
            const txRes = await fetch(
              `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${currentLog.entityId}/transactions?page=0&size=20`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (txRes.ok) {
              const txJson = await txRes.json();
              const txList = txJson.data?.content || [];
              // Sort transactions by date (most recent first)
              txList.sort(
                (a: Transaction, b: Transaction) =>
                  new Date(b.createdOn).getTime() -
                  new Date(a.createdOn).getTime()
              );
              setTransactions(txList);
            }
          } catch (e) {
            console.error("Failed to fetch product:", e);
          }
        }

        // 5. Fetch user details
        try {
          const usersRes = await fetch(
            `${API_BASE_URL}/api/v1/organizations/${orgId}/users`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (usersRes.ok) {
            const usersJson = await usersRes.json();
            const users = usersJson.data?.content || usersJson.data || [];
            const foundUser = users.find(
              (u: { id: string }) => u.id === currentLog.userId
            );
            if (foundUser) {
              // Try to get photo from localStorage if it's the current user
              let photoUrl = foundUser.photoUrl;
              const currentUserEmail = localStorage.getItem("userEmail");
              if (foundUser.email === currentUserEmail && !photoUrl) {
                photoUrl =
                  localStorage.getItem(`profileImage_${foundUser.email}`) ||
                  undefined;
              }

              setUser({
                id: foundUser.id,
                fullName:
                  foundUser.fullName || foundUser.name || "Unknown User",
                email: foundUser.email || currentLog.userEmail,
                photoUrl: photoUrl,
                phone: foundUser.phone || foundUser.phoneNumber,
                role: foundUser.role || foundUser.roleName,
              });
            } else {
              // User not found in org users, check if it's the current user
              const currentUserEmail = localStorage.getItem("userEmail");
              const currentUserName =
                localStorage.getItem("userFullName") ||
                localStorage.getItem("userName");
              let photoUrl: string | undefined;

              if (currentLog.userEmail === currentUserEmail) {
                photoUrl =
                  localStorage.getItem(`profileImage_${currentUserEmail}`) ||
                  undefined;
              }

              setUser({
                id: currentLog.userId,
                fullName:
                  currentLog.userEmail === currentUserEmail && currentUserName
                    ? currentUserName
                    : currentLog.userEmail.split("@")[0],
                email: currentLog.userEmail,
                photoUrl: photoUrl,
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch users:", e);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (logId) fetchData();
  }, [logId, router]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isCheckIn = log?.description.toLowerCase().includes("checked in");
  const isCheckOut = log?.description.toLowerCase().includes("checked out");

  // Extract quantity from description
  const getQuantity = () => {
    if (!log) return 1;
    const match = log.description.match(/(\d+)\s*units/);
    return match ? parseInt(match[1]) : 1;
  };

  // Extract purpose from description
  const getPurpose = () => {
    if (!log) return "Equipment usage";
    const purposeMatch = log.description.match(/Purpose:\s*(.+)/i);
    return purposeMatch
      ? purposeMatch[1].trim()
      : "Equipment usage for scheduled work";
  };

  const handleCheckOutAgain = () => {
    if (product) {
      router.push("/dashboard/products");
    }
  };

  const handleViewItemDetails = () => {
    if (product) {
      router.push(`/dashboard/products/edit/${product.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!log) return null;

  const quantity = getQuantity();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Activity Log Details
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 break-all">
              Transaction ID: LOG-{log.id.slice(0, 4).toUpperCase()}-
              {log.id.slice(4, 8).toUpperCase()}-
              {log.id.slice(8, 11).toUpperCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="px-3 sm:px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 flex items-center gap-2 text-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Status Banner */}
        <div
          className={`${
            isCheckIn
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          } border rounded-lg p-4 mb-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${
                isCheckIn ? "bg-green-500" : "bg-orange-500"
              } rounded-full flex items-center justify-center text-white`}
            >
              {isCheckIn ? (
                <ArrowDownToLine size={20} />
              ) : (
                <ArrowUpFromLine size={20} />
              )}
            </div>
            <div>
              <h3
                className={`font-semibold ${
                  isCheckIn ? "text-green-900" : "text-orange-900"
                }`}
              >
                {isCheckIn
                  ? "Check-In Completed"
                  : isCheckOut
                  ? "Check-Out Completed"
                  : "Activity Completed"}
              </h3>
              <p
                className={`text-sm ${
                  isCheckIn ? "text-green-700" : "text-orange-700"
                }`}
              >
                {isCheckIn
                  ? "Item successfully returned to inventory"
                  : "Item checked out from inventory"}
              </p>
            </div>
          </div>
          <span
            className={`text-sm ${
              isCheckIn ? "text-green-700" : "text-orange-700"
            }`}
          >
            ● Completed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-900" />
                Transaction Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Log ID</p>
                    <p className="font-medium text-gray-800">
                      LOG-{log.id.slice(0, 4).toUpperCase()}-
                      {log.id.slice(4, 8).toUpperCase()}-
                      {log.id.slice(8, 11).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(log.createdOn)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(log.createdOn)}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Event Type</p>
                    <span
                      className={`inline-block px-3 py-1 ${
                        isCheckIn
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      } rounded-full text-sm font-medium`}
                    >
                      {isCheckIn
                        ? "↓ Check-In"
                        : isCheckOut
                        ? "↑ Check-Out"
                        : log.activityType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Entity Type</p>
                    <p className="font-medium text-gray-800">
                      {log.entityType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            {product && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package size={18} className="text-red-900" />
                  Item Details
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={product.photoUrl || "/placeholder-product.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 break-words">
                      {product.description || "No description available"}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Product ID</p>
                        <p className="text-sm font-medium">
                          {product.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm font-medium">
                          {product.categoryName || "Uncategorized"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Available Qty</p>
                        <p className="text-sm font-medium">
                          {product.availableQuantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Checked Out</p>
                        <p className="text-sm font-medium">
                          {product.checkedOutQuantity}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Quantity Change
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {quantityChange.before}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span
                            className={`font-semibold ${
                              isCheckIn ? "text-green-600" : "text-orange-600"
                            }`}
                          >
                            {quantityChange.after}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {isCheckIn ? "Return Quantity" : "Checkout Quantity"}
                        </p>
                        <div
                          className={`${
                            isCheckIn ? "text-green-600" : "text-orange-600"
                          } font-semibold text-xl`}
                        >
                          {isCheckIn ? "+" : "-"}
                          {quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={18} className="text-red-900" />
                User Information
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                  {user?.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-lg sm:text-xl font-semibold">
                      {user?.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">
                      {user?.fullName || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role || "Staff"} • ID:{" "}
                      {user?.id?.slice(0, 8).toUpperCase() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {user?.email || log.userEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {user?.phone || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Activities</p>
                    <p className="font-medium text-gray-800">
                      {relatedLogs.length + 1} activities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Comments */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-red-900" />
                Notes & Comments
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-900 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-900" />
                      Activity Description
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(log.createdOn)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{log.description}</p>
                </div>
                {(isCheckIn || isCheckOut) && (
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <AlertCircle size={14} className="text-blue-500" />
                        {isCheckIn ? "Return Details" : "Checkout Purpose"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatShortDate(log.createdOn)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{getPurpose()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Item Snapshots */}
            {product && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera size={18} className="text-red-900" />
                  Item Snapshot
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-100 rounded border border-gray-200 overflow-hidden relative">
                      <Image
                        src={product.photoUrl || "/placeholder-product.png"}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                      Current
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleCheckOutAgain}
                  disabled={!product || product.availableQuantity === 0}
                  className="w-full px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpFromLine size={16} />
                  Check Out Again
                </button>
                <button
                  onClick={handleViewItemDetails}
                  disabled={!product}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Package size={16} />
                  View Item Details
                </button>
                <button
                  onClick={() => router.push("/dashboard/activity")}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Clock size={16} />
                  View Full History
                </button>
              </div>
            </div>

            {/* Activity Timeline - from real transactions */}
            <div className="bg-white rounded-lg border-2 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Activity Timeline
              </h3>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((tx, index) => {
                    const isFirst = index === 0;
                    const isTxCheckIn = tx.transactionType === "CHECK_IN";
                    const isTxCheckOut = tx.transactionType === "CHECK_OUT";
                    const isTxRestock = tx.transactionType === "RESTOCK";

                    let bgColor = "bg-gray-100";
                    let dotColor = "bg-gray-500";
                    let icon = <RefreshCw size={12} />;

                    if (isTxCheckIn) {
                      bgColor = "bg-green-100";
                      dotColor = "bg-green-500";
                      icon = (
                        <ArrowDownToLine size={12} className="text-green-600" />
                      );
                    } else if (isTxCheckOut) {
                      bgColor = "bg-orange-100";
                      dotColor = "bg-orange-500";
                      icon = (
                        <ArrowUpFromLine
                          size={12}
                          className="text-orange-600"
                        />
                      );
                    } else if (isTxRestock) {
                      bgColor = "bg-blue-100";
                      dotColor = "bg-blue-500";
                      icon = <Package size={12} className="text-blue-600" />;
                    }

                    return (
                      <div key={tx.id} className="flex gap-3">
                        <div
                          className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          {isFirst ? (
                            icon
                          ) : (
                            <div
                              className={`w-2 h-2 ${dotColor} rounded-full`}
                            ></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {isTxCheckIn
                              ? "Check-In"
                              : isTxCheckOut
                              ? "Check-Out"
                              : isTxRestock
                              ? "Restock"
                              : tx.transactionType}
                            {tx.checkOutStatus === "OPEN" && (
                              <span className="text-orange-500 text-xs ml-1">
                                (Open)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatShortDate(tx.createdOn)},{" "}
                            {formatTime(tx.createdOn)} • {tx.quantity} units
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No transaction history
                  </p>
                )}
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                System Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Created By</p>
                  <p className="font-medium text-gray-800">System Audit Log</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Log ID</p>
                  <p className="font-medium text-gray-800 font-mono text-xs">
                    {log.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Entity ID</p>
                  <p className="font-medium text-gray-800 font-mono text-xs">
                    {log.entityId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Organization ID</p>
                  <p className="font-medium text-gray-800 font-mono text-xs">
                    {log.organizationId}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Transactions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Related Activity Logs
              </h3>
              <div className="space-y-2">
                {relatedLogs.slice(0, 3).map((relatedLog) => {
                  const isRelatedCheckIn = relatedLog.description
                    .toLowerCase()
                    .includes("checked in");
                  const isRelatedCheckOut = relatedLog.description
                    .toLowerCase()
                    .includes("checked out");

                  return (
                    <button
                      key={relatedLog.id}
                      onClick={() =>
                        router.push(`/dashboard/activity/${relatedLog.id}`)
                      }
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
                    >
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-800">
                          {isRelatedCheckIn
                            ? "Check-In"
                            : isRelatedCheckOut
                            ? "Check-Out"
                            : relatedLog.activityType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatShortDate(relatedLog.createdOn)},{" "}
                          {formatTime(relatedLog.createdOn)}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  );
                })}
                {relatedLogs.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No related activity logs
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
