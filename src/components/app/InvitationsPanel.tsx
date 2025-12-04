// components/app/InvitationsPanel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  RotateCw,
  Trash2,
} from "lucide-react";
import {
  getOrgInvitations,
  resendInvitation,
  revokeInvitation,
  InvitationData,
} from "@/services/authService";

interface InvitationsPanelProps {
  organizationId: number;
  show: boolean;
  onClose: () => void;
}

export default function InvitationsPanel({
  organizationId,
  show,
  onClose,
}: InvitationsPanelProps) {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrgInvitations(organizationId.toString());

      if (response.status_code === 200 || response.status === "success") {
        setInvitations(response.data as unknown as InvitationData[]);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (show) {
      fetchInvitations();
    }
  }, [show, fetchInvitations]);

  const handleResend = async (invitationId: string, email: string) => {
    try {
      const response = await resendInvitation(
        organizationId.toString(),
        invitationId,
        email
      );

      if (
        response.status_code === 200 ||
        response.status_code === 204 ||
        response.status === "success"
      ) {
        toast.success("Invitation resent successfully!");
      } else {
        toast.error(response.message || "Failed to resend invitation");
      }
    } catch {
      toast.error("Failed to resend invitation");
    }
  };

  const handleRevoke = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) return;

    try {
      const response = await revokeInvitation(
        organizationId.toString(),
        invitationId
      );

      if (
        response.status_code === 200 ||
        response.status_code === 204 ||
        response.status === "success"
      ) {
        toast.success("Invitation cancelled successfully");
        fetchInvitations(); // Refresh list
      } else {
        toast.error(response.message || "Failed to cancel invitation");
      }
    } catch {
      toast.error("Failed to cancel invitation");
    }
  };

  const handleRemoveFromList = async (invitationId: string) => {
    try {
      const response = await revokeInvitation(
        organizationId.toString(),
        invitationId
      );

      if (
        response.status_code === 200 ||
        response.status_code === 204 ||
        response.status === "success"
      ) {
        toast.success("Invitation removed from list");
        fetchInvitations();
      } else {
        // If API delete fails, just remove from local state
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        toast.success("Invitation removed from list");
      }
    } catch {
      // If API call fails, still remove from local state
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast.success("Invitation removed from list");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Pending Invitations
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage organization invitations
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending invitations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {invitation.inviteeEmail}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {invitation.role}
                        </span>
                        <span className="text-gray-300">•</span>
                        {invitation.status === "PENDING" && (
                          <span className="flex items-center gap-1 text-xs text-yellow-600">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {invitation.status === "ACCEPTED" && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Accepted
                          </span>
                        )}
                        {invitation.status === "DECLINED" && (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {invitation.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleResend(invitation.id, invitation.inviteeEmail)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Resend invitation"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRevoke(invitation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {invitation.status !== "PENDING" && (
                      <button
                        onClick={() => handleRemoveFromList(invitation.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Remove from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
