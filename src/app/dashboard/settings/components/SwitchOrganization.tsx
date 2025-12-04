"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface Organization {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
}

export default function SwitchOrganization() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
    const orgId =
      sessionStorage.getItem("organizationId") ||
      localStorage.getItem("organizationId");
    setCurrentOrgId(orgId);
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch organizations");

      const json = await res.json();
      const list = json?.data?.content ?? json?.data ?? [];

      setOrganizations(
        list.map(
          (org: {
            id: string;
            name: string;
            description?: string;
            memberCount?: number;
            member_count?: number;
          }) => ({
            id: org.id,
            name: org.name,
            description: org.description,
            memberCount: org.memberCount || org.member_count || 1,
          })
        )
      );
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchOrganization = async (orgId: string) => {
    if (orgId === currentOrgId) return;

    setSwitching(orgId);
    try {
      // Update storage
      localStorage.setItem("organizationId", orgId);
      sessionStorage.setItem("organizationId", orgId);
      setCurrentOrgId(orgId);

      toast.success("Switched organization successfully!");

      // Refresh the page to load new organization data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Failed to switch organization:", error);
      toast.error("Failed to switch organization");
    } finally {
      setSwitching(null);
    }
  };

  const handleGoToOrganizations = () => {
    router.push("/app");
  };

  const currentOrg = organizations.find((org) => org.id === currentOrgId);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Building2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Switch Organization
          </h2>
          <p className="text-sm text-gray-500">
            Manage and switch between your organizations
          </p>
        </div>
      </div>

      {/* Current Organization */}
      {currentOrg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {currentOrg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentOrg.name}</p>
                <p className="text-xs text-gray-500">Current organization</p>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>
        </div>
      )}

      {/* Organizations List */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            Your Organizations
          </p>
          <button
            onClick={fetchOrganizations}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800020]"></div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No organizations found</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSwitchOrganization(org.id)}
                disabled={switching === org.id || org.id === currentOrgId}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  org.id === currentOrgId
                    ? "border-green-300 bg-green-50 cursor-default"
                    : "border-gray-200 hover:border-[#800020] hover:bg-gray-50"
                } ${switching === org.id ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                      org.id === currentOrgId ? "bg-green-600" : "bg-[#800020]"
                    }`}
                  >
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-500">
                      {org.memberCount} member{org.memberCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {org.id === currentOrgId ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : switching === org.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#800020]"></div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleGoToOrganizations}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#800020] text-white rounded-lg hover:bg-[#6a0019] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Manage Organizations
        </button>
      </div>
    </div>
  );
}
