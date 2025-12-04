import React, { useState, useEffect } from "react";
import { Edit2, Trash2, X, Mail, RefreshCw } from "lucide-react";
import {
  sendInvitation,
  getOrgInvitations,
  revokeInvitation,
  resendInvitation,
} from "@/services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Store Staff" | "Viewer";
  status: "Active" | "Inactive";
  lastActive: string;
  avatar: string;
}

interface InvitationItem {
  id: string;
  email: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELLED";
  createdOn: string;
}

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showToast: (message: string, type?: "success" | "error") => void;
}

export default function UserManagement({
  users,
  setUsers,
  showToast,
}: UserManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [allInvitations, setAllInvitations] = useState<InvitationItem[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer" as User["role"],
  });

  // Fetch all invitations on mount
  useEffect(() => {
    fetchAllInvitations();
  }, []);

  const fetchAllInvitations = async () => {
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      if (!orgId) return;

      const response = await getOrgInvitations(orgId);

      if (response.status === "success" || response.status_code === 200) {
        // Handle both array and paginated response
        const rawData = response.data;
        let invitationsList: Array<{
          id: string;
          inviteeEmail: string;
          role: string;
          status: string;
          createdOn: string;
        }> = [];

        if (Array.isArray(rawData)) {
          invitationsList = rawData;
        } else if (
          rawData &&
          "content" in rawData &&
          Array.isArray(rawData.content)
        ) {
          invitationsList = rawData.content;
        }

        const mapped = invitationsList.map((inv) => ({
          id: inv.id,
          email: inv.inviteeEmail,
          role: inv.role,
          status: inv.status as InvitationItem["status"],
          createdOn: inv.createdOn,
        }));

        setAllInvitations(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email) {
      showToast("Please enter an email address", "error");
      return;
    }

    setIsInviting(true);
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      if (!orgId) {
        showToast("No organization selected", "error");
        return;
      }

      // Map role to API format (API accepts: STAFF, OWNER, ADMIN)
      const apiRole = newUser.role === "Admin" ? "ADMIN" : "STAFF";

      const response = await sendInvitation(orgId, {
        email: newUser.email,
        role: apiRole,
      });

      console.log("Invitation response:", response);

      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 201
      ) {
        setShowAddModal(false);
        showToast("Invitation sent successfully!", "success");
        setNewUser({ name: "", email: "", role: "Viewer" });
        fetchAllInvitations();
      } else {
        // Close modal so user can see the error toast
        setShowAddModal(false);
        console.error("Invitation error:", response);
        showToast(response.message || "Failed to send invitation", "error");
      }
    } catch (error) {
      setShowAddModal(false);
      console.error("Failed to send invitation:", error);
      showToast("Failed to send invitation", "error");
    } finally {
      setIsInviting(false);
    }
  };

  const handleResendInvitation = async (
    invitationId: string,
    email: string
  ) => {
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      if (!orgId) {
        showToast("No organization selected", "error");
        return;
      }

      const response = await resendInvitation(orgId, invitationId, email);
      console.log("Resend invitation response:", response);

      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 204
      ) {
        showToast("Invitation resent successfully!", "success");
      } else {
        showToast(response.message || "Failed to resend invitation", "error");
      }
    } catch (error) {
      console.error("Resend invitation error:", error);
      showToast("Failed to resend invitation", "error");
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      if (!orgId) {
        showToast("No organization selected", "error");
        return;
      }

      const response = await revokeInvitation(orgId, invitationId);
      console.log("Revoke invitation response:", response);

      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 204
      ) {
        showToast("Invitation cancelled successfully", "success");
        fetchAllInvitations();
      } else {
        showToast(response.message || "Failed to cancel invitation", "error");
      }
    } catch (error) {
      console.error("Revoke invitation error:", error);
      showToast("Failed to cancel invitation", "error");
    }
  };

  // Remove invitation from the displayed list (for non-pending invitations)
  const handleRemoveInvitationFromList = async (invitationId: string) => {
    try {
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");
      if (!orgId) {
        showToast("No organization selected", "error");
        return;
      }

      // Try to delete from API first
      const response = await revokeInvitation(orgId, invitationId);
      console.log("Remove invitation response:", response);

      if (
        response.status === "success" ||
        response.status_code === 200 ||
        response.status_code === 204
      ) {
        showToast("Invitation removed from list", "success");
        fetchAllInvitations();
      } else {
        // If API delete fails, just remove from local state
        setAllInvitations((prev) =>
          prev.filter((inv) => inv.id !== invitationId)
        );
        showToast("Invitation removed from list", "success");
      }
    } catch (error) {
      // If API call fails, still remove from local state
      console.error("Remove invitation error:", error);
      setAllInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
      showToast("Invitation removed from list", "success");
    }
  };

  const handleEditUser = () => {
    if (!userToEdit) return;

    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === userToEdit.id ? userToEdit : u
      );
      localStorage.setItem("inventrix_users", JSON.stringify(updated));
      return updated;
    });
    setShowEditModal(false);
    setUserToEdit(null);
    showToast("User updated successfully!", "success");
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== userToDelete.id);
      localStorage.setItem("inventrix_users", JSON.stringify(updated));
      return updated;
    });
    setShowDeleteModal(false);
    setUserToDelete(null);
    showToast("User deleted successfully", "success");
  };

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700";
      case "Store Staff":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeColor = (status: User["status"]) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  };

  const getStatusDotColor = (status: User["status"]) => {
    return status === "Active" ? "bg-emerald-600" : "bg-amber-600";
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage users and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#900022] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#a80025] transition-all active:scale-95"
          >
            <Mail className="w-4 h-4" />
            Invite User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#900022] to-[#600015] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(
                          user.status
                        )}`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All Invitations */}
        {allInvitations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitations ({allInvitations.length})
            </h3>
            <div className="space-y-2">
              {allInvitations.map((inv) => {
                // Color coding based on status
                const statusColors = {
                  PENDING: {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-700",
                    dot: "bg-amber-500",
                  },
                  ACCEPTED: {
                    bg: "bg-green-50",
                    border: "border-green-200",
                    text: "text-green-700",
                    dot: "bg-green-500",
                  },
                  DECLINED: {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-700",
                    dot: "bg-red-500",
                  },
                  EXPIRED: {
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                    text: "text-gray-700",
                    dot: "bg-gray-500",
                  },
                  CANCELLED: {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-700",
                    dot: "bg-red-500",
                  },
                };
                const colors = statusColors[inv.status] || statusColors.PENDING;

                return (
                  <div
                    key={inv.id}
                    className={`flex items-center justify-between p-3 ${colors.bg} border ${colors.border} rounded-lg`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {inv.email}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
                          />
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {inv.role} • Invited{" "}
                        {new Date(inv.createdOn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inv.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              handleResendInvitation(inv.id, inv.email)
                            }
                            className="p-1.5 rounded hover:bg-amber-100 transition"
                            title="Resend invitation"
                          >
                            <RefreshCw className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            onClick={() => handleRevokeInvitation(inv.id)}
                            className="p-1.5 rounded hover:bg-red-100 transition"
                            title="Cancel invitation"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      {inv.status !== "PENDING" && (
                        <button
                          onClick={() => handleRemoveInvitationFromList(inv.id)}
                          className="p-1.5 rounded hover:bg-gray-200 transition"
                          title="Remove from list"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Invite User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Invite Team Member
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Send an invitation to join your organization
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                  placeholder="colleague@company.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  An invitation email will be sent to this address
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as User["role"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                >
                  <option value="Store Staff">
                    Member - Can manage inventory
                  </option>
                  <option value="Admin">Admin - Full access</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isInviting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isInviting}
                className="flex-1 px-4 py-2 bg-[#900022] rounded-lg text-sm font-medium text-white hover:bg-[#a80025] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isInviting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Update user information
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userToEdit.name}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userToEdit.role}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      role: e.target.value as User["role"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Store Staff">Store Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={userToEdit.status}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      status: e.target.value as User["status"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#900022] focus:ring-2 focus:ring-[#900022]/20 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-2 bg-[#900022] rounded-lg text-sm font-medium text-white hover:bg-[#a80025] transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{userToDelete.name}</span>? This
                will permanently remove their access to the system.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
