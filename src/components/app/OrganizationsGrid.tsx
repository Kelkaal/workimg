import {
  Plus,
  Building2,
  Mail,
  Settings,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { FaCircleQuestion } from "react-icons/fa6";
import Image from "next/image";
import React from "react";
import { Organization, Invitation } from "./constants";
import Link from "next/link";
import { useOrganizationStore } from "@/stores/organizationStore";

interface OrganizationsGridProps {
  organizations: Organization[];
  filter: "all" | "my";
  setFilter: (filter: "all" | "my") => void;
  myOrgsCount: number;
  filteredOrgs: Organization[];
  onCreateOrg: () => void;
  onEditOrg: (org: Organization) => void;
  onDeleteOrg: (id: string) => void;
  invitations: Invitation[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  hasActiveOrganizations: boolean;
  onSelectOrg: (id: string) => void;
}

const OrganizationsGrid: React.FC<OrganizationsGridProps> = ({
  filter,
  setFilter,
  myOrgsCount,
  filteredOrgs,
  onCreateOrg,
  onEditOrg,
  onDeleteOrg,
  invitations,
  onAccept,
  onDecline,
  hasActiveOrganizations,
  onSelectOrg,
}) => {
  const pendingInvitations = invitations.filter(
    (inv) => !inv.accepted && !inv.declined
  );
  const { setOrganizationId } = useOrganizationStore();
  // console.log('Rendering OrganizationsGrid with filteredOrgs:', filteredOrgs);
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Inventrix !
        </h2>
        <p className="text-gray-600 text-lg">
          Get started by creating an organization or joining an existing one
        </p>
      </div>

      {/* Create Organization Banner */}
      <div className="bg-linear-to-r from-[#800020] to-[#a00028] rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Create New Organization</h3>
            </div>
            <p className="text-white/90 mb-6 max-w-lg">
              Start managing your inventory by setting up your organization
            </p>
            <button
              onClick={onCreateOrg}
              className="bg-white text-[#800020] px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg active:scale-95 hover:cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Create Organization
            </button>
          </div>
          <Image
            src="/assets/workspace.jpg"
            alt="Create Organization"
            width={300}
            height={300}
            className="hidden md:block ml-8 rounded-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Organizations List */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Your Organizations
            </h3>
            <span className="px-3 py-1 bg-pink-100 text-[#800020] rounded-full text-sm font-semibold">
              {filteredOrgs.length} Active
            </span>
          </div>

          {myOrgsCount > 0 && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition hover:cursor-pointer ${filter === "all"
                    ? "bg-[#800020] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("my")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition hover:cursor-pointer ${filter === "my"
                    ? "bg-[#800020] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                My Organizations ({myOrgsCount})
              </button>
            </div>
          )}

          <div className="space-y-3">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {org.name}
                      </h4>
                      <p className="text-xs text-gray-600 font-bold">owner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Active
                    </span>
                    <button
                      onClick={() => onEditOrg(org)}
                      className="p-1.5 hover:bg-gray-100 rounded transition hover:cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDeleteOrg(org.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition hover:cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                {org.description && (
                  <p className="text-sm text-gray-600 mb-2 ml-[52px]">
                    {org.description}
                  </p>
                )}
                <div className="flex items-center justify-between ml-[52px]">
                  {/* <span className="text-sm text-gray-600">
                    <Package className="h-4 w-4 inline mr-1" />
                    {org.productCount.toLocaleString()} Products
                  </span> */}
                  <Link href="/dashboard">
                    <button
                      onClick={() => (
                        onSelectOrg(org.id),
                        console.log("Selected org ID:", org.id),
                        localStorage.setItem(
                          "organizationId",
                          org.id as string
                        ),
                        sessionStorage.setItem(
                          "organizationId",
                          org.id as string
                        ),
                        setOrganizationId(org.id)
                      )}
                      className="text-sm text-[#800020] font-medium hover:underline cursor-pointer"
                    >
                      Open Dashboard →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Pending Invitations
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {pendingInvitations.length} New
            </span>
          </div>

          {!hasActiveOrganizations && pendingInvitations.length > 0 && (
            <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-yellow-800">
                Invitations are hidden until you create your first organization.
              </p>
            </div>
          )}

          {hasActiveOrganizations && pendingInvitations.length > 0 ? (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {invitation.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Invited by {invitation.invitedBy}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        • {invitation.daysAgo} days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(invitation.id)}
                      className="flex-1 bg-[#800020] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#600018] transition flex items-center justify-center gap-1 active:scale-[0.98] hover:cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => onDecline(invitation.id)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-1 active:scale-[0.98] hover:cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Invitations Yet
              </h4>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                You dont have any pending invitations. Check back later or
                create your own organization to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center shrink-0">
            <FaCircleQuestion className="h-6 w-6 text-[#2563EB]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Need Help Getting Started?
            </h4>
            <p className="text-gray-700 text-sm mb-4">
              Learn how to set up your organization, invite team members, and
              start managing your inventory efficiently
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
              >
                View Documentation
                <span>→</span>
              </Link>
              <Link
                href="#"
                className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
              >
                Watch Tutorial
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
              >
                Contact Support
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationsGrid;
