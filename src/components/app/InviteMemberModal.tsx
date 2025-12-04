// components/app/InviteMemberModal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X, Mail, UserPlus } from "lucide-react";
import { sendInvitation } from "@/services/authService";

interface InviteMemberModalProps {
  show: boolean;
  organizationId: number;
  organizationName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteMemberModal({
  show,
  organizationId,
  organizationName,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);

    try {
      console.log("📧 Sending invitation to:", email);

      const response = await sendInvitation(organizationId.toString(), {
        email: email.trim(),
        role,
      });

      console.log("📦 Invitation response:", response);

      if (
        response.status_code === 200 ||
        response.status_code === 201 ||
        response.status === "success"
      ) {
        toast.success("Invitation sent!", {
          description: `${email} has been invited to join ${organizationName}`,
        });

        setEmail("");
        setRole("STAFF");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to send invitation", {
          description: response.message || "Please try again",
        });
      }
    } catch (error) {
      console.error("💥 Invitation error:", error);
      toast.error("Failed to send invitation", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#800020] rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invite Member</h2>
              <p className="text-sm text-gray-500">{organizationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none"
                disabled={isSending}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Well send them an invitation email
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("STAFF")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === "STAFF"
                    ? "border-[#800020] bg-[#FCE7EB]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                disabled={isSending}
              >
                <div className="font-semibold text-sm text-gray-900">
                  Member
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  View & edit products
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === "ADMIN"
                    ? "border-[#800020] bg-[#FCE7EB]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                disabled={isSending}
              >
                <div className="font-semibold text-sm text-gray-900">Admin</div>
                <div className="text-xs text-gray-500 mt-1">Full access</div>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> The invitee will receive an email with a
              link to accept the invitation. They must have an account or create
              one to join.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#6a001a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
